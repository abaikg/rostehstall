"use client";
import { useState, useMemo, useCallback } from "react";
import {
  CalculationInputs,
  MaterialCode,
  MaterialGradeCode,
  ProductCode,
  CalculatorMode,
  InputFieldKey,
  CalculationResult,
  CalculatorPreset,
} from "@/lib/metal-calculator/types";
import { calculateWeight, calculateLength } from "@/lib/metal-calculator/formulas";
import { validateInputs } from "@/lib/metal-calculator/validation/validateInputs";
import { MATERIALS, MATERIAL_GRADES, getDefaultGrade } from "@/lib/metal-calculator/config/materials";
import { PRODUCTS } from "@/lib/metal-calculator/config/products";
import { getSection, getSections, isSectionProduct } from "@/lib/metal-calculator/config/sections";

interface UseMetalCalculatorProps {
  defaultMaterial?: MaterialCode;
  defaultProduct?: ProductCode;
  /** Пресет из каталога, применяемый при открытии (диплинк /calculator?item=…) */
  initialPreset?: CalculatorPreset | null;
  onCalculated?: (result: number) => void;
}

const DEFAULT_VALUES = {
  thickness: 1,
  width: 1000,
  length: 1,
  diameter: 100,
  sideA: 50,
  sideB: 50,
  weight: 100,
} satisfies CalculationInputs["values"];

const emptyResult = (mode: CalculatorMode): CalculationResult => ({
  value: 0,
  unit: mode === "weight_by_dimensions" ? "кг" : "м",
  isCalculated: false,
});

// Состояние инпутов после применения пресета из каталога
const inputsFromPreset = (preset: CalculatorPreset, prev?: CalculationInputs): CalculationInputs => {
  const section = preset.sectionCode
    ? getSection(preset.productCode, preset.sectionCode)
    : undefined;

  return {
    material: preset.materialCode,
    grade: preset.gradeCode ?? getDefaultGrade(preset.materialCode),
    product: preset.productCode,
    mode: prev?.mode ?? "weight_by_dimensions",
    section: section?.code,
    presetKgm: preset.kgm,
    presetKgsm: preset.kgsm,
    values: {
      ...DEFAULT_VALUES,
      length: prev?.values.length ?? 1,
      weight: prev?.values.weight ?? 100,
      ...(section ? { sideA: section.h, sideB: section.b, thickness: section.s } : {}),
      ...preset.presetValues,
    },
  };
};

export const useMetalCalculator = ({
  defaultMaterial = "steel",
  defaultProduct = "sheet",
  initialPreset,
  onCalculated,
}: UseMetalCalculatorProps = {}) => {
  const [inputs, setInputs] = useState<CalculationInputs>(() =>
    initialPreset
      ? inputsFromPreset(initialPreset)
      : {
          material: defaultMaterial,
          grade: getDefaultGrade(defaultMaterial),
          product: defaultProduct,
          mode: "weight_by_dimensions",
          values: DEFAULT_VALUES,
        }
  );
  const [activePresetId, setActivePresetId] = useState<string | null>(initialPreset?.id ?? null);
  const [submittedResult, setSubmittedResult] = useState<CalculationResult>(() => emptyResult("weight_by_dimensions"));

  const handleInputChange = useCallback((key: InputFieldKey, value: number) => {
    // Правка длины/веса не меняет саму позицию — справочный вес сохраняем
    const keepsPosition = key === "length" || key === "weight";
    if (!keepsPosition) setActivePresetId(null);
    setInputs((prev) => ({
      ...prev,
      // Ручная правка размеров переводит табличный прокат в режим формулы
      section: keepsPosition ? prev.section : undefined,
      presetKgm: keepsPosition ? prev.presetKgm : undefined,
      presetKgsm: keepsPosition ? prev.presetKgsm : undefined,
      values: { ...prev.values, [key]: value },
    }));
  }, []);

  const setSection = useCallback((code: string) => {
    setActivePresetId(null);
    setInputs((prev) => {
      const sectionConfig = getSection(prev.product, code);
      if (!sectionConfig) return { ...prev, section: undefined, presetKgm: undefined, presetKgsm: undefined };
      return {
        ...prev,
        section: code,
        presetKgm: undefined,
        presetKgsm: undefined,
        // Размеры из таблицы — для схемы и полей формы
        values: {
          ...prev.values,
          sideA: sectionConfig.h,
          sideB: sectionConfig.b,
          thickness: sectionConfig.s,
        },
      };
    });
  }, []);

  const setMaterial = useCallback((material: MaterialCode) => {
    setActivePresetId(null);
    setInputs((prev) => {
      // ГОСТ-номера двутавра/швеллера нормированы для стали — при уходе
      // с чёрного металла переключаем табличный прокат на лист
      const leavesSteel = material !== "steel" && isSectionProduct(prev.product);
      return {
        ...prev,
        material,
        grade: getDefaultGrade(material),
        product: leavesSteel ? "sheet" : prev.product,
        section: leavesSteel ? undefined : prev.section,
        // Другой металл — каталожный вес позиции больше не применим
        presetKgm: undefined,
        presetKgsm: undefined,
      };
    });
  }, []);

  const setGrade = useCallback((grade: MaterialGradeCode) => {
    setInputs((prev) => {
      // Марка не изменилась — ничего не сбрасываем
      if (prev.grade === grade) return prev;
      // Другая марка — каталожный вес позиции больше не применим, считаем по формуле
      return { ...prev, grade, presetKgm: undefined, presetKgsm: undefined };
    });
  }, []);

  const setProduct = useCallback((product: ProductCode) => {
    setActivePresetId(null);
    setInputs((prev) => {
      // Для табличного проката сразу подставляем первый номер по ГОСТ
      const defaultSection = isSectionProduct(product) ? getSections(product)[0] : undefined;
      return {
        ...prev,
        product,
        grade: getDefaultGrade(prev.material),
        section: defaultSection?.code,
        presetKgm: undefined,
        presetKgsm: undefined,
        values: defaultSection
          ? { ...prev.values, sideA: defaultSection.h, sideB: defaultSection.b, thickness: defaultSection.s }
          : prev.values,
      };
    });
  }, []);

  const setMode = useCallback((mode: CalculatorMode) => {
    setInputs((prev) => ({ ...prev, mode }));
  }, []);

  const applyPreset = useCallback((preset: CalculatorPreset | null) => {
    if (!preset) {
      setActivePresetId(null);
      return;
    }

    setActivePresetId(preset.id);
    setInputs((prev) => inputsFromPreset(preset, prev));
  }, []);

  // Восстановление сохранённого расчёта (история)
  const restoreInputs = useCallback((saved: CalculationInputs) => {
    setActivePresetId(null);
    setInputs({ ...saved, values: { ...saved.values } });
  }, []);

  const reset = useCallback(() => {
    setInputs({
      material: "steel",
      grade: getDefaultGrade("steel"),
      product: "sheet",
      mode: "weight_by_dimensions",
      values: DEFAULT_VALUES,
    });
    setActivePresetId(null);
    setSubmittedResult(emptyResult("weight_by_dimensions"));
  }, []);

  const errors = useMemo(() => validateInputs(inputs), [inputs]);

  const draftResult: CalculationResult = useMemo(() => {
    if (errors.length > 0) {
      return {
        ...emptyResult(inputs.mode),
        error: errors[0].message,
      };
    }

    const unitWeight = calculateWeight({
      ...inputs,
      mode: "weight_by_dimensions",
      values: { ...inputs.values, length: 1 },
    });
    const value = inputs.mode === "weight_by_dimensions"
      ? calculateWeight(inputs)
      : calculateLength(inputs.values.weight || 0, inputs);
    const length = inputs.mode === "weight_by_dimensions" ? inputs.values.length : value;
    const area = inputs.product === "sheet" && inputs.values.width && length
      ? (inputs.values.width / 1000) * length
      : undefined;
    const sheetWeight = inputs.product === "sheet" && inputs.values.width && length
      ? calculateWeight({
          ...inputs,
          mode: "weight_by_dimensions",
          values: { ...inputs.values, length },
        })
      : undefined;

    return {
      value,
      unit: inputs.mode === "weight_by_dimensions" ? "кг" : "м",
      unitWeight,
      length,
      materialName: MATERIALS[inputs.material].name,
      gradeName: inputs.grade ? MATERIAL_GRADES[inputs.grade]?.name : undefined,
      productName: inputs.section
        ? `${PRODUCTS[inputs.product].label} ${getSection(inputs.product, inputs.section)?.label ?? inputs.section}`
        : PRODUCTS[inputs.product].label,
      sheetWeight,
      area,
      isCalculated: true,
    };
  }, [errors, inputs]);

  const calculate = useCallback(() => {
    setSubmittedResult(draftResult);
    if (!draftResult.error && onCalculated) {
      onCalculated(draftResult.value);
    }
  }, [draftResult, onCalculated]);

  return {
    inputs,
    result: submittedResult,
    draftResult,
    errors,
    activePresetId,
    handleInputChange,
    setMaterial,
    setGrade,
    setProduct,
    setSection,
    setMode,
    calculate,
    applyPreset,
    restoreInputs,
    reset,
  };
};
