"use client";
import { useState, useMemo, useCallback } from "react";
import {
  CalculationInputs,
  MaterialCode,
  ProductCode,
  CalculatorMode,
  InputFieldKey,
  CalculationResult,
  CalculatorPreset
} from "@/lib/metal-calculator/types";
import { calculateWeight, calculateLength } from "@/lib/metal-calculator/formulas";
import { validateInputs } from "@/lib/metal-calculator/validation/validateInputs";

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

export const useMetalCalculator = ({
  defaultMaterial = "steel",
  defaultProduct = "sheet",
  onCalculated
}: UseMetalCalculatorProps = {}) => {
  const [inputs, setInputs] = useState<CalculationInputs>({
    material: defaultMaterial,
    product: defaultProduct,
    mode: "weight_by_dimensions",
    values: DEFAULT_VALUES
  });
  const [activePresetId, setActivePresetId] = useState<string | null>(null);

  const handleInputChange = useCallback((key: InputFieldKey, value: number) => {
    setActivePresetId(null);
    setInputs((prev) => ({
      ...prev,
      values: { ...prev.values, [key]: value }
    }));
  }, []);

  const setMaterial = useCallback((material: MaterialCode) => {
    setActivePresetId(null);
    setInputs((prev) => ({ ...prev, material }));
  }, []);

  const setProduct = useCallback((product: ProductCode) => {
    setActivePresetId(null);
    setInputs((prev) => ({ ...prev, product }));
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
      product: preset.productCode,
      values: {
        ...DEFAULT_VALUES,
        length: prev.values.length ?? 1,
        weight: prev.values.weight ?? 100,
        ...preset.presetValues,
      }
    }));
  }, []);

  const reset = useCallback(() => {
    setInputs({
      material: "steel",
      product: "sheet",
      mode: "weight_by_dimensions",
      values: DEFAULT_VALUES
    });
    setActivePresetId(null);
  }, []);

  const errors = useMemo(() => validateInputs(inputs), [inputs]);

  const result: CalculationResult = useMemo(() => {
    if (errors.length > 0) {
      return {
        value: 0,
        unit: inputs.mode === "weight_by_dimensions" ? "кг" : "м",
        error: errors[0].message
      };
    }

    const value =
      inputs.mode === "weight_by_dimensions"
        ? calculateWeight(inputs)
        : calculateLength(inputs.values.weight || 0, inputs);

    if (onCalculated) onCalculated(value);

    return {
      value,
      unit: inputs.mode === "weight_by_dimensions" ? "кг" : "м"
    };
  }, [errors, inputs, onCalculated]);

  return {
    inputs,
    result,
    errors,
    activePresetId,
    handleInputChange,
    setMaterial,
    setProduct,
    setMode,
    applyPreset,
    reset
  };
};
