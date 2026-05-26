"use client";
import React from "react";
import { CalculationResult } from "@/lib/metal-calculator/types";

interface ResultProps {
  result: CalculationResult;
}

export const CalculatorResult = ({ result }: ResultProps) => {
  return (
    <div className="flex flex-col pt-6 border-t border-gray-100 max-w-full overflow-hidden">
      <div className="flex flex-col gap-1 max-w-full">
         <span className="text-[11px] font-bold tracking-widest uppercase text-gray-500">Итог ГОСТ</span>
         <div className="flex items-baseline gap-2 w-full">
            <span className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tighter text-gray-900 break-all">
               {result.value.toLocaleString('ru-RU', { maximumFractionDigits: 4, minimumFractionDigits: 2 })}
            </span>
            <span className="text-sm sm:text-base lg:text-lg font-bold text-gray-500 shrink-0">{result.unit}</span>
         </div>
      </div>
      <p className="text-[11px] font-medium text-gray-500 mt-4 leading-relaxed max-w-full break-words">
        Теоретическая масса по стандартам ГОСТ. Фактическая масса может отличаться из-за допусков металлопроката (±3-5%).
      </p>
    </div>
  );
};
