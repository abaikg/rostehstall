"use client";
import React from "react";
import { CalculationResult } from "@/lib/metal-calculator/types";

interface ResultProps {
  result: CalculationResult;
  compact?: boolean;
}

export const CalculatorResult = ({ result, compact = false }: ResultProps) => {
  return (
    <div className={`${compact ? "items-center bg-gray-50 px-4 py-3 text-center" : "pt-5 sm:pt-6"} flex flex-col border-t border-gray-100 max-w-full`}>
      <div className={`flex flex-col ${compact ? "gap-0.5" : "gap-1"} max-w-full`}>
        <span className={`${compact ? "text-[10px]" : "text-[11px]"} font-bold tracking-widest uppercase text-gray-500`}>
          Итог ГОСТ
        </span>
        <div className={`flex flex-wrap items-baseline ${compact ? "justify-center" : ""} gap-x-2 gap-y-1 w-full min-w-0`}>
          <span className={`${compact ? "text-xl" : "text-[clamp(1.75rem,9vw,2.5rem)] lg:text-5xl"} min-w-0 font-bold tracking-tight text-gray-900 break-words`}>
            {result.value.toLocaleString("ru-RU", { maximumFractionDigits: 4, minimumFractionDigits: 2 })}
          </span>
          <span className={`${compact ? "text-sm" : "text-sm sm:text-base lg:text-lg"} font-bold text-gray-500 shrink-0`}>
            {result.unit}
          </span>
        </div>
      </div>
      {!compact && (
        <p className="text-[10px] sm:text-[11px] font-medium text-gray-500 mt-3 sm:mt-4 leading-relaxed max-w-full break-words">
          Теоретическая масса по стандартам ГОСТ. Фактическая масса может отличаться из-за допусков металлопроката (±3-5%).
        </p>
      )}
    </div>
  );
};
