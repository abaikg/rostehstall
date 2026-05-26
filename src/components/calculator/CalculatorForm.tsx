"use client";
import React from "react";
import { 
  CalculationInputs,
  InputFieldKey,
  ValidationError,
  ProductConfig,
  CalculatorMode
} from "@/lib/metal-calculator/types";

interface FormProps {
  productConfig: ProductConfig;
  mode: CalculatorMode;
  inputs: CalculationInputs;
  errors: ValidationError[];
  onInputChange: (key: InputFieldKey, value: number) => void;
  onModeChange: (mode: CalculatorMode) => void;
}

export const CalculatorForm = ({
  productConfig,
  mode,
  inputs,
  errors,
  onInputChange,
  onModeChange
}: FormProps) => {
  const getError = (key: string) => errors.find(e => e.key === key)?.message;

  return (
    <div className="flex flex-col gap-6 max-w-full overflow-hidden">
      
      {/* Modern Switcher */}
      <div className="flex bg-gray-100 border border-gray-200 rounded-2xl p-1 shadow-inner shrink-0">
        <button 
          onClick={() => onModeChange('weight_by_dimensions')} 
          className={`flex-1 py-2 text-[11px] font-bold uppercase tracking-wider rounded-xl transition-all duration-300 whitespace-nowrap overflow-hidden text-ellipsis ${
            mode === 'weight_by_dimensions' 
              ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-200/50' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Вес
        </button>
        <button 
          onClick={() => onModeChange('length_by_weight')} 
          className={`flex-1 py-2 text-[11px] font-bold uppercase tracking-wider rounded-xl transition-all duration-300 whitespace-nowrap overflow-hidden text-ellipsis ${
            mode === 'length_by_weight' 
              ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-200/50' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Длина
        </button>
      </div>

      <div className="flex flex-col gap-5">
        {productConfig.fields.map((field: any) => (
          <div key={field.key} className="flex flex-col gap-1.5 relative group max-w-full">
            <label className="text-[13px] font-bold tracking-tight text-gray-700 group-focus-within:text-brand-primary transition-colors flex items-center justify-between">
              <span className="truncate pr-2">{field.label}</span>
              <span className="text-[10px] uppercase font-bold text-gray-500 bg-gray-200 rounded px-1.5 shrink-0">{field.key}</span>
            </label>
            <div className="relative">
               <input 
                 type="number"
                 value={inputs.values[field.key as keyof typeof inputs.values] || ""}
                 onChange={(e) => onInputChange(field.key as InputFieldKey, parseFloat(e.target.value))}
                 className={`w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[15px] font-bold text-gray-900 outline-none transition-all duration-200 ${
                   getError(field.key) ? 'border-red-400/50 ring-4 ring-red-400/10' : 'hover:border-gray-400 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 shadow-sm'
                 }`}
               />
               <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[13px] font-bold text-gray-500 shrink-0">
                 {field.unit}
               </span>
            </div>
            {getError(field.key) && (
              <span className="text-[10px] text-red-500 absolute -bottom-4">{getError(field.key)}</span>
            )}
          </div>
        ))}

        <div className="flex flex-col gap-1.5 relative mt-3 group max-w-full">
          <label className="text-[13px] font-bold tracking-tight text-brand-primary flex items-center justify-between">
             <span className="truncate pr-2">{mode === 'weight_by_dimensions' ? 'Длина для расчета' : 'Масса для расчета'}</span>
             <span className="text-[10px] uppercase font-bold text-white bg-brand-primary rounded px-1.5 shrink-0">{mode === 'weight_by_dimensions' ? 'L' : 'Вес'}</span>
          </label>
          <div className="relative">
             <input 
               type="number"
               value={mode === 'weight_by_dimensions' ? (inputs.values.length || "") : (inputs.values.weight || "")}
               onChange={(e) => onInputChange(mode === 'weight_by_dimensions' ? 'length' : 'weight', parseFloat(e.target.value))}
               className={`w-full bg-blue-50 border border-brand-primary/30 rounded-xl px-4 py-3 text-[15px] font-bold text-brand-primary outline-none transition-all duration-200 ${
                 getError(mode === 'weight_by_dimensions' ? 'length' : 'weight') ? 'border-red-400' : 'hover:border-brand-primary/60 focus:border-brand-primary focus:bg-white shadow-sm'
               }`}
             />
             <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[13px] font-bold text-brand-primary/70 shrink-0">
               {mode === 'weight_by_dimensions' ? 'м.' : 'кг.'}
             </span>
          </div>
        </div>
      </div>
    </div>
  );
};
