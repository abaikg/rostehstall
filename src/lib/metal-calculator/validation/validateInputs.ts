import { CalculationInputs, ValidationError } from "../types";
import { PRODUCT_LIST } from "../config/products";

export const validateInputs = (inputs: CalculationInputs): ValidationError[] => {
  const errors: ValidationError[] = [];
  const { product, mode, values } = inputs;
  
  // 1. Check required fields for the selected product
  const config = PRODUCT_LIST.find(p => p.code === product);
  if (config) {
    config.fields.forEach((field) => {
      const val = values[field.key as keyof typeof values];
      if (val === undefined || val === null || isNaN(val)) {
        errors.push({ key: field.key, message: `Введите ${field.label.toLowerCase()}` });
      } else if (val <= 0) {
        errors.push({ key: field.key, message: `${field.label} должен быть больше нуля` });
      } else if (field.max && val > field.max) {
        errors.push({ key: field.key, message: `Значение ${field.label} слишком велико` });
      }
    });
  }

  // 2. Check mode specific fields
  if (mode === 'weight_by_dimensions') {
    const len = values.length;
    if (len === undefined || len === null || isNaN(len)) {
      errors.push({ key: 'length', message: 'Введите длину' });
    } else if (len <= 0) {
      errors.push({ key: 'length', message: 'Длина должна быть больше нуля' });
    }
  } else {
    const w = values.weight;
    if (w === undefined || w === null || isNaN(w)) {
      errors.push({ key: 'weight', message: 'Введите вес' });
    } else if (w <= 0) {
      errors.push({ key: 'weight', message: 'Вес должен быть больше нуля' });
    }
  }

  // 3. Logic validation (e.g. wall thickness < diameter)
  if (product === 'pipe_round' || product === 'pipe_profile') {
    const t = values.thickness || 0;
    const d = values.diameter || values.sideA || 0;
    if (t * 2 >= d) {
      errors.push({ key: 'thickness', message: 'Толщина стенки слишком большая' });
    }
  }

  return errors;
};
