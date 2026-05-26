"use client";
import { useState, useMemo, useCallback } from "react";
import { 
  CalculationInputs, 
  MaterialCode, 
  ProductCode, 
  CalculatorMode, 
  InputFieldKey,
  CalculationResult,
  ValidationError
} from "@/lib/metal-calculator/types";
import { calculateWeight, calculateLength } from "@/lib/metal-calculator/formulas";
import { validateInputs } from "@/lib/metal-calculator/validation/validateInputs";

interface UseMetalCalculatorProps {
  defaultMaterial?: MaterialCode;
  defaultProduct?: ProductCode;
  onCalculated?: (result: number) => void;
}

export const useMetalCalculator = ({ 
  defaultMaterial = 'steel', 
  defaultProduct = 'sheet',
  onCalculated 
}: UseMetalCalculatorProps = {}) => {
  const [inputs, setInputs] = useState<CalculationInputs>({
    material: defaultMaterial,
    product: defaultProduct,
    mode: 'weight_by_dimensions',
    values: {
      thickness: 1,
      width: 1000,
      length: 1,
      diameter: 100,
      sideA: 50,
      sideB: 50,
      weight: 100
    }
  });

  const [errors, setErrors] = useState<ValidationError[]>([]);

  const handleInputChange = useCallback((key: InputFieldKey, value: number) => {
    setInputs(prev => ({
      ...prev,
      values: { ...prev.values, [key]: value }
    }));
  }, []);

  const setMaterial = useCallback((material: MaterialCode) => {
    setInputs(prev => ({ ...prev, material }));
  }, []);

  const setProduct = useCallback((product: ProductCode) => {
    setInputs(prev => ({ ...prev, product }));
  }, []);

  const setMode = useCallback((mode: CalculatorMode) => {
    setInputs(prev => ({ ...prev, mode }));
  }, []);

  const reset = useCallback(() => {
    setInputs({
      material: 'steel',
      product: 'sheet',
      mode: 'weight_by_dimensions',
      values: {
        thickness: 1,
        width: 1000,
        length: 1,
        diameter: 100,
        sideA: 50,
        sideB: 50,
        weight: 100
      }
    });
    setErrors([]);
  }, []);

  const result: CalculationResult = useMemo(() => {
    const validationErrors = validateInputs(inputs);
    setErrors(validationErrors);

    if (validationErrors.length > 0) {
      return { value: 0, unit: inputs.mode === 'weight_by_dimensions' ? 'кг' : 'м', error: validationErrors[0].message };
    }

    let value = 0;
    if (inputs.mode === 'weight_by_dimensions') {
      value = calculateWeight(inputs);
    } else {
      value = calculateLength(inputs.values.weight || 0, inputs);
    }

    if (onCalculated) onCalculated(value);

    return {
      value,
      unit: inputs.mode === 'weight_by_dimensions' ? 'кг' : 'м'
    };
  }, [inputs, onCalculated]);

  return {
    inputs,
    result,
    errors,
    handleInputChange,
    setMaterial,
    setProduct,
    setMode,
    reset
  };
};
