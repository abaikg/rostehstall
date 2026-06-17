"use client";
import React from "react";
import { MaterialCode, ProductCode } from "@/lib/metal-calculator/types";
import { MATERIAL_LIST } from "@/lib/metal-calculator/config/materials";
import { PRODUCT_LIST } from "@/lib/metal-calculator/config/products";

interface SelectorProps {
  currentMaterial: MaterialCode;
  currentProduct: ProductCode;
  onMaterialChange: (code: MaterialCode) => void;
  onProductChange: (code: ProductCode) => void;
  variant?: "cards" | "selects";
}

export const SelectionBlocks = ({ 
  currentMaterial, 
  currentProduct, 
  onMaterialChange, 
  onProductChange,
  variant = "cards",
}: SelectorProps) => {
  if (variant === "selects") {
    const selectClass = "h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-[14px] font-semibold text-gray-900 outline-none transition-colors focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10";
    const labelClass = "text-[12px] font-bold leading-none text-gray-800";

    return (
      <div className="flex flex-col gap-3 max-w-full">
        <label className="flex flex-col gap-1.5">
          <span className={labelClass}>Металл</span>
          <select
            value={currentMaterial}
            onChange={(event) => onMaterialChange(event.target.value as MaterialCode)}
            className={selectClass}
          >
            {MATERIAL_LIST.map((m) => (
              <option key={m.code} value={m.code}>
                {m.name}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className={labelClass}>Сортамент</span>
          <select
            value={currentProduct}
            onChange={(event) => onProductChange(event.target.value as ProductCode)}
            className={selectClass}
          >
            {PRODUCT_LIST.map((p) => (
              <option key={p.code} value={p.code}>
                {p.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 sm:gap-10 max-w-full">
      
      {/* Металл */}
      <div className="flex flex-col gap-3 sm:gap-4 max-w-full">
        <span className="text-[11px] font-bold uppercase tracking-widest text-gray-500 shrink-0">1. Сплав</span>
        <ul className="flex flex-wrap gap-2">
          {MATERIAL_LIST.map((m) => (
            <li key={m.code}>
              <button
                onClick={() => onMaterialChange(m.code)}
                className={`min-h-11 px-4 py-2.5 rounded-full text-[13px] font-semibold transition-all duration-200 whitespace-nowrap ${
                  currentMaterial === m.code
                    ? "bg-gray-900 text-white shadow-sm"
                    : "bg-white text-gray-700 border border-gray-300 hover:border-gray-400 hover:text-gray-900"
                }`}
              >
                {m.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Сортамент (Текстовая сетка) */}
      <div className="flex flex-col gap-3 sm:gap-4 max-w-full">
        <span className="text-[12px] font-bold uppercase tracking-widest text-gray-500 shrink-0">2. Форм-фактор</span>
        <ul className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-2 gap-2">
          {PRODUCT_LIST.map((p) => (
            <li key={p.code}>
              <button
                onClick={() => onProductChange(p.code)}
                className={`w-full min-h-14 flex items-center justify-start gap-2.5 sm:gap-3 px-3 sm:px-4 py-3 rounded-xl transition-all duration-200 border text-left group ${
                  currentProduct === p.code
                    ? "bg-brand-primary/10 border-brand-primary/40 text-brand-primary font-bold"
                    : "bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <div className={`w-1.5 h-1.5 rounded-full shrink-0 transition-colors ${currentProduct === p.code ? "bg-brand-primary" : "bg-gray-400 group-hover:bg-gray-600"}`}></div>
                <span className={`min-w-0 text-[12px] sm:text-[13px] font-bold leading-tight break-words ${currentProduct === p.code ? "text-brand-primary" : "text-gray-700 group-hover:text-gray-900"}`}>
                  {p.label}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      
    </div>
  );
};
