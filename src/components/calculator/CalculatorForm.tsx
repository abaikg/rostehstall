"use client";
import React from "react";
import {
  CalculationInputs,
  InputFieldKey,
  ValidationError,
  ProductConfig,
  FieldConfig,
  CalculatorMode,
} from "@/lib/metal-calculator/types";

interface FormProps {
  productConfig: ProductConfig;
  mode: CalculatorMode;
  inputs: CalculationInputs;
  errors: ValidationError[];
  onInputChange: (key: InputFieldKey, value: number) => void;
  compact?: boolean;
}

export const CalculatorForm = ({
  productConfig,
  mode,
  inputs,
  errors,
  onInputChange,
  compact = false,
}: FormProps) => {
  const getError = (key: string) => errors.find((error) => error.key === key)?.message;
  const activeInputKey: InputFieldKey = mode === "weight_by_dimensions" ? "length" : "weight";
  const activeInputError = getError(activeInputKey);
  const nominalDiameterProducts = productConfig.code === "rebar" || productConfig.code === "rod";
  const nominalDiameterOptions = [6, 8, 10, 12, 14, 16, 18, 20, 22, 25, 28, 32, 36];

  const inputClass = compact
    ? "h-10 w-full bg-gray-50 rounded-xl py-2 pl-3 pr-12 text-[16px] font-bold text-gray-900 outline-none transition-all duration-200"
    : "min-h-12 w-full bg-gray-50 rounded-xl py-3 pl-4 pr-14 text-[16px] sm:text-[15px] font-bold text-gray-900 outline-none transition-all duration-200";
  const highlightedInputClass = compact
    ? "h-10 w-full bg-brand-primary/10 rounded-xl py-2 pl-3 pr-12 text-[16px] font-bold text-brand-primary outline-none transition-all duration-200"
    : "min-h-12 w-full bg-brand-primary/10 rounded-xl py-3 pl-4 pr-14 text-[16px] sm:text-[15px] font-bold text-brand-primary outline-none transition-all duration-200";
  const labelClass = compact
    ? "text-[12px] font-bold tracking-tight text-gray-700 group-focus-within:text-brand-primary transition-colors flex items-center justify-between"
    : "text-[13px] font-bold tracking-tight text-gray-700 group-focus-within:text-brand-primary transition-colors flex items-center justify-between";
  const unitClass = compact
    ? "absolute right-3 top-1/2 -translate-y-1/2 text-[12px] font-bold text-gray-500 shrink-0"
    : "absolute right-4 top-1/2 -translate-y-1/2 text-[13px] font-bold text-gray-500 shrink-0";

  return (
    <div className={`flex flex-col ${compact ? "gap-3" : "gap-5 sm:gap-6"} max-w-full`}>
      <div className={`flex flex-col ${compact ? "gap-2.5" : "gap-4 sm:gap-5"}`}>
        {productConfig.fields.map((field: FieldConfig) => {
          const error = getError(field.key);
          const isDiameterSelect = field.key === "diameter" && nominalDiameterProducts;
          const currentValue = inputs.values[field.key];
          const diameterOptions =
            isDiameterSelect && Number.isFinite(currentValue) && currentValue && !nominalDiameterOptions.includes(currentValue)
              ? [...nominalDiameterOptions, currentValue].sort((a, b) => a - b)
              : nominalDiameterOptions;
          const label = isDiameterSelect
            ? productConfig.code === "rebar"
              ? "Номинальный диаметр"
              : "Диаметр круга D"
            : field.label;

          return (
            <div key={field.key} className="flex flex-col gap-1.5 group max-w-full">
              <label className={labelClass}>
                <span className="truncate pr-2">{label}</span>
              </label>
              <div className="relative">
                {isDiameterSelect ? (
                  <select
                    value={inputs.values[field.key] || ""}
                    onChange={(event) => onInputChange(field.key, parseFloat(event.target.value))}
                    className={`${inputClass} appearance-auto ${
                      error ? "ring-4 ring-red-400/10" : "focus:bg-white focus:ring-4 focus:ring-brand-primary/10 shadow-sm"
                    }`}
                  >
                    {diameterOptions.map((diameter) => (
                      <option key={diameter} value={diameter}>
                        {diameter}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="number"
                    inputMode="decimal"
                    step="any"
                    min={field.min}
                    max={field.max}
                    value={inputs.values[field.key] || ""}
                    onChange={(event) => onInputChange(field.key, parseFloat(event.target.value))}
                    className={`${inputClass} ${
                      error ? "ring-4 ring-red-400/10" : "focus:bg-white focus:ring-4 focus:ring-brand-primary/10 shadow-sm"
                    }`}
                  />
                )}
                <span className={unitClass}>{field.unit}</span>
              </div>
              {error && <span className="text-[11px] font-medium text-red-500">{error}</span>}
            </div>
          );
        })}

        <div className={`flex flex-col gap-1.5 group max-w-full ${compact ? "" : "mt-2 sm:mt-3"}`}>
          <label className={`${compact ? "text-[12px]" : "text-[13px]"} font-bold tracking-tight text-brand-primary flex items-center justify-between`}>
            <span className="truncate pr-2">{mode === "weight_by_dimensions" ? "Длина для расчёта" : "Масса для расчёта"}</span>
          </label>
          <div className="relative">
            <input
              type="number"
              inputMode="decimal"
              step="any"
              value={mode === "weight_by_dimensions" ? (inputs.values.length || "") : (inputs.values.weight || "")}
              onChange={(event) => onInputChange(activeInputKey, parseFloat(event.target.value))}
              className={`${highlightedInputClass} ${
                activeInputError ? "ring-4 ring-red-400/10" : "focus:bg-white focus:ring-4 focus:ring-brand-primary/10 shadow-sm"
              }`}
            />
            <span className={`${compact ? "right-3 text-[12px]" : "right-4 text-[13px]"} absolute top-1/2 -translate-y-1/2 font-bold text-brand-primary/70 shrink-0`}>
              {mode === "weight_by_dimensions" ? "м" : "кг"}
            </span>
          </div>
          {activeInputError && <span className="text-[11px] font-medium text-red-500">{activeInputError}</span>}
        </div>
      </div>
    </div>
  );
};
