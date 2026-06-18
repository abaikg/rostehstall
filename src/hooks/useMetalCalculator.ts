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

interface UseMetalCalculatorProps {
  defaultMaterial?: MaterialCode;
  defaultProduct?: ProductCode;
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

export const useMetalCalculator = ({
  defaultMaterial = "steel",
  defaultProduct = "sheet",
  onCalculated,
}: UseMetalCalculatorProps = {}) => {
  const [inputs, setInputs] = useState<CalculationInputs>({
    material: defaultMaterial,
    grade: getDefaultGrade(defaultMaterial),
    product: defaultProduct,
    mode: "weight_by_dimensions",
    values: DEFAULT_VALUES,
  });
  const [activePresetId, setActivePresetId] = useState<string | null>(null);
  const [submittedResult, setSubmittedResult] = useState<CalculationResult>(() => emptyResult("weight_by_dimensions"));

  const handleInputChange = useCallback((key: InputFieldKey, value: number) => {
    setActivePresetId(null);
    setInputs((prev) => ({
      ...prev,
      values: { ...prev.values, [key]: value },
    }));
  }, []);

  const setMaterial = useCallback((material: MaterialCode) => {
    setActivePresetId(null);
    setInputs((prev) => ({ ...prev, material, grade: getDefaultGrade(material) }));
  }, []);

  const setGrade = useCallback((grade: MaterialGradeCode) => {
    setInputs((prev) => ({ ...prev, grade }));
  }, []);

  const setProduct = useCallback((product: ProductCode) => {
    setActivePresetId(null);
    setInputs((prev) => ({ ...prev, product, grade: getDefaultGrade(prev.material) }));
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
    setInputs((prev) => ({
      ...prev,
      material: preset.materialCode,
      grade: preset.gradeCode ?? getDefaultGrade(preset.materialCode),
      product: preset.productCode,
      values: {
        ...DEFAULT_VALUES,
        length: prev.values.length ?? 1,
        weight: prev.values.weight ?? 100,
        ...preset.presetValues,
      },
    }));
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
      productName: PRODUCTS[inputs.product].label,
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
    setMode,
    calculate,
    applyPreset,
    reset,
  };
};
