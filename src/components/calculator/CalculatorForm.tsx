"use client";
import React from "react";
import {
  CalculationInputs,
  InputFieldKey,
  ValidationError,
  ProductConfig,
  FieldConfig,
  CalculatorMode
} from "@/lib/metal-calculator/types";

interface FormProps {
  productConfig: ProductConfig;
  mode: CalculatorMode;
  inputs: CalculationInputs;
  errors: ValidationError[];
  onInputChange: (key: InputFieldKey, value: number) => void;
  onModeChange: (mode: CalculatorMode) => void;
  compact?: boolean;
}

export const CalculatorForm = ({
  productConfig,
  mode,
  inputs,
  errors,
  onInputChange,
  onModeChange,
  compact = false
}: FormProps) => {
  const getError = (key: string) => errors.find(e => e.key === key)?.message;
  const activeInputKey: InputFieldKey = mode === "weight_by_dimensions" ? "length" : "weight";
  const activeInputError = getError(activeInputKey);

  const switchButtonClass = compact
    ? "min-h-9 flex-1 px-2 py-1.5 text-[11px]"
    : "min-h-11 flex-1 px-3 py-2.5 text-[11px]";
  const inputClass = compact
    ? "h-10 w-full bg-white border border-gray-200 rounded-lg py-2 pl-3 pr-12 text-[16px] font-bold text-gray-900 outline-none transition-all duration-200"
    : "min-h-12 w-full bg-white border border-gray-200 rounded-xl py-3 pl-4 pr-14 text-[16px] sm:text-[15px] font-bold text-gray-900 outline-none transition-all duration-200";
  const highlightedInputClass = compact
    ? "h-10 w-full bg-blue-50 border border-brand-primary/30 rounded-lg py-2 pl-3 pr-12 text-[16px] font-bold text-brand-primary outline-none transition-all duration-200"
    : "min-h-12 w-full bg-blue-50 border border-brand-primary/30 rounded-xl py-3 pl-4 pr-14 text-[16px] sm:text-[15px] font-bold text-brand-primary outline-none transition-all duration-200";
  const labelClass = compact
    ? "text-[12px] font-bold tracking-tight text-gray-700 group-focus-within:text-brand-primary transition-colors flex items-center justify-between"
    : "text-[13px] font-bold tracking-tight text-gray-700 group-focus-within:text-brand-primary transition-colors flex items-center justify-between";
  const unitClass = compact
    ? "absolute right-3 top-1/2 -translate-y-1/2 text-[12px] font-bold text-gray-500 shrink-0"
    : "absolute right-4 top-1/2 -translate-y-1/2 text-[13px] font-bold text-gray-500 shrink-0";

  return (
    <div className={`flex flex-col ${compact ? "gap-3" : "gap-5 sm:gap-6"} max-w-full`}>
      <div className={`flex bg-gray-100 border border-gray-200 p-1 shadow-inner shrink-0 ${compact ? "rounded-xl" : "rounded-2xl"}`}>
        <button
          type="button"
          onClick={() => onModeChange("weight_by_dimensions")}
          className={`${switchButtonClass} font-bold uppercase tracking-wider rounded-lg sm:rounded-xl transition-all duration-300 whitespace-nowrap overflow-hidden text-ellipsis ${
            mode === "weight_by_dimensions"
              ? "bg-white text-gray-900 shadow-sm ring-1 ring-gray-200/50"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Вес
        </button>
        <button
          type="button"
          onClick={() => onModeChange("length_by_weight")}
          className={`${switchButtonClass} font-bold uppercase tracking-wider rounded-lg sm:rounded-xl transition-all duration-300 whitespace-nowrap overflow-hidden text-ellipsis ${
            mode === "length_by_weight"
              ? "bg-white text-gray-900 shadow-sm ring-1 ring-gray-200/50"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Длина
        </button>
      </div>

      <div className={`flex flex-col ${compact ? "gap-2.5" : "gap-4 sm:gap-5"}`}>
        {productConfig.fields.map((field: FieldConfig) => {
          const error = getError(field.key);

          return (
            <div key={field.key} className="flex flex-col gap-1.5 group max-w-full">
              <label className={labelClass}>
                <span className="truncate pr-2">{field.label}</span>
                <span className="text-[10px] uppercase font-bold text-gray-500 bg-gray-200 rounded px-1.5 shrink-0">{field.key}</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  inputMode="decimal"
                  step="any"
                  min={field.min}
                  max={field.max}
                  value={inputs.values[field.key] || ""}
                  onChange={(e) => onInputChange(field.key, parseFloat(e.target.value))}
                  className={`${inputClass} ${
                    error ? "border-red-400/50 ring-4 ring-red-400/10" : "hover:border-gray-400 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 shadow-sm"
                  }`}
                />
                <span className={unitClass}>{field.unit}</span>
              </div>
              {error && (
                <span className="text-[11px] font-medium text-red-500">{error}</span>
              )}
            </div>
          );
        })}

        <div className={`flex flex-col gap-1.5 group max-w-full ${compact ? "" : "mt-2 sm:mt-3"}`}>
          <label className={`${compact ? "text-[12px]" : "text-[13px]"} font-bold tracking-tight text-brand-primary flex items-center justify-between`}>
            <span className="truncate pr-2">{mode === "weight_by_dimensions" ? "Длина для расчета" : "Масса для расчета"}</span>
            <span className="text-[10px] uppercase font-bold text-white bg-brand-primary rounded px-1.5 shrink-0">{mode === "weight_by_dimensions" ? "L" : "Вес"}</span>
          </label>
          <div className="relative">
            <input
              type="number"
              inputMode="decimal"
              step="any"
              value={mode === "weight_by_dimensions" ? (inputs.values.length || "") : (inputs.values.weight || "")}
              onChange={(e) => onInputChange(activeInputKey, parseFloat(e.target.value))}
              className={`${highlightedInputClass} ${
                activeInputError ? "border-red-400 ring-4 ring-red-400/10" : "hover:border-brand-primary/60 focus:border-brand-primary focus:bg-white focus:ring-4 focus:ring-brand-primary/10 shadow-sm"
              }`}
            />
            <span className={`${compact ? "right-3 text-[12px]" : "right-4 text-[13px]"} absolute top-1/2 -translate-y-1/2 font-bold text-brand-primary/70 shrink-0`}>
              {mode === "weight_by_dimensions" ? "м." : "кг."}
            </span>
          </div>
          {activeInputError && (
            <span className="text-[11px] font-medium text-red-500">{activeInputError}</span>
          )}
        </div>
      </div>
    </div>
  );
};
