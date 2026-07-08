"use client";
import React from "react";
import { MaterialCode, MaterialGradeCode, ProductCode } from "@/lib/metal-calculator/types";
import { MATERIAL_LIST, getGradesByMaterial } from "@/lib/metal-calculator/config/materials";
import { PRODUCT_LIST } from "@/lib/metal-calculator/config/products";

interface SelectorProps {
  currentMaterial: MaterialCode;
  currentGrade?: MaterialGradeCode;
  currentProduct: ProductCode;
  onMaterialChange: (code: MaterialCode) => void;
  onGradeChange: (code: MaterialGradeCode) => void;
  onProductChange: (code: ProductCode) => void;
  variant?: "cards" | "selects";
}

export const SelectionBlocks = ({
  currentMaterial,
  currentGrade,
  currentProduct,
  onMaterialChange,
  onGradeChange,
  onProductChange,
  variant = "cards",
}: SelectorProps) => {
  const gradeList = getGradesByMaterial(currentMaterial);

  if (variant === "selects") {
    const selectClass = "h-10 w-full rounded-xl bg-gray-50 px-3 text-[14px] font-semibold text-gray-900 outline-none transition-colors focus:bg-white focus:ring-2 focus:ring-brand-primary/10";
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
            {MATERIAL_LIST.map((material) => (
              <option key={material.code} value={material.code}>
                {material.name}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className={labelClass}>Марка / сплав</span>
          <select
            value={currentGrade ?? ""}
            onChange={(event) => onGradeChange(event.target.value as MaterialGradeCode)}
            className={selectClass}
          >
            {gradeList.map((grade) => (
              <option key={grade.code} value={grade.code}>
                {grade.name}
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
            {PRODUCT_LIST.map((product) => (
              <option key={product.code} value={product.code}>
                {product.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 sm:gap-8 max-w-full">
      <div className="flex flex-col gap-3 sm:gap-4 max-w-full">
        <span className="text-[11px] font-bold uppercase tracking-widest text-gray-500 shrink-0">2. Металл</span>
        <ul className="flex flex-wrap gap-2">
          {MATERIAL_LIST.map((material) => (
            <li key={material.code}>
              <button
                type="button"
                onClick={() => onMaterialChange(material.code)}
                className={`min-h-11 px-4 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-200 whitespace-nowrap ${
                  currentMaterial === material.code
                    ? "bg-gray-900 text-white shadow-sm"
                    : "bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {material.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-3 sm:gap-4 max-w-full">
        <span className="text-[12px] font-bold uppercase tracking-widest text-gray-500 shrink-0">3. Марка / сплав</span>
        <select
          value={currentGrade ?? ""}
          onChange={(event) => onGradeChange(event.target.value as MaterialGradeCode)}
          className="h-11 w-full rounded-xl bg-gray-50 px-4 text-[13px] font-semibold text-gray-900 outline-none transition-colors focus:bg-white focus:ring-2 focus:ring-brand-primary/10"
        >
          {gradeList.map((grade) => (
            <option key={grade.code} value={grade.code}>
              {grade.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-3 sm:gap-4 max-w-full">
        <span className="text-[12px] font-bold uppercase tracking-widest text-gray-500 shrink-0">4. Сортамент</span>
        <ul className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-2 gap-2">
          {PRODUCT_LIST.map((product) => (
            <li key={product.code}>
              <button
                type="button"
                onClick={() => onProductChange(product.code)}
                className={`w-full min-h-14 flex items-center justify-start gap-2.5 sm:gap-3 px-3 sm:px-4 py-3 rounded-xl transition-all duration-200 text-left group ${
                  currentProduct === product.code
                    ? "bg-brand-primary/10 text-brand-primary font-bold"
                    : "bg-white hover:bg-gray-50"
                }`}
              >
                <div className={`w-1.5 h-1.5 rounded-full shrink-0 transition-colors ${currentProduct === product.code ? "bg-brand-primary" : "bg-gray-400 group-hover:bg-gray-600"}`} />
                <span className={`min-w-0 text-[12px] sm:text-[13px] font-bold leading-tight break-words ${currentProduct === product.code ? "text-brand-primary" : "text-gray-700 group-hover:text-gray-900"}`}>
                  {product.label}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
