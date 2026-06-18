"use client";
import React from "react";
import { CalculationResult } from "@/lib/metal-calculator/types";

interface ResultProps {
  result: CalculationResult;
  compact?: boolean;
}

const formatNumber = (value: number, maximumFractionDigits = 4) =>
  value.toLocaleString("ru-RU", {
    maximumFractionDigits,
    minimumFractionDigits: 2,
  });

const formatArea = (value: number) =>
  value.toLocaleString("ru-RU", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  });

const formatWeight = (value: number) =>
  value.toLocaleString("ru-RU", {
    maximumFractionDigits: 3,
    minimumFractionDigits: 3,
  });

export const CalculatorResult = ({ result, compact = false }: ResultProps) => {
  if (!result.isCalculated) {
    if (!result.error) return null;

    return (
      <div className={`${compact ? "items-center bg-red-50 px-4 py-3 text-center" : "px-5 py-4 sm:px-8"} flex flex-col max-w-full`}>
        <span className={`${compact ? "text-[10px]" : "text-[11px]"} font-bold tracking-widest uppercase text-red-500`}>
          Ошибка
        </span>
        <p className={`${compact ? "text-[12px]" : "text-[13px]"} mt-2 font-semibold text-red-600`}>
          {result.error}
        </p>
      </div>
    );
  }

  if (result.error) {
    return (
      <div className={`${compact ? "items-center bg-red-50 px-4 py-3 text-center" : "px-5 py-4 sm:px-8"} flex flex-col max-w-full`}>
        <span className={`${compact ? "text-[10px]" : "text-[11px]"} font-bold tracking-widest uppercase text-red-500`}>
          Ошибка
        </span>
        <p className={`${compact ? "text-[12px]" : "text-[13px]"} mt-2 font-semibold text-red-600`}>
          {result.error}
        </p>
      </div>
    );
  }

  const sheetWeight = result.sheetWeight ?? (result.unit === "кг" ? result.value : undefined);
  const hasSheetArea = typeof result.area === "number" && typeof sheetWeight === "number";
  const rows = [
    result.unitWeight ? ["Вес 1 м", `${formatNumber(result.unitWeight)} кг/м`] : null,
    result.length ? ["Длина", `${formatNumber(result.length, 2)} м`] : null,
    result.sheetWeight && result.unit === "кг" && !hasSheetArea ? ["Масса листа", `${formatNumber(result.sheetWeight)} кг`] : null,
    result.materialName ? ["Металл", result.materialName] : null,
    result.gradeName ? ["Марка", result.gradeName] : null,
    result.productName ? ["Сортамент", result.productName] : null,
  ].filter(Boolean) as [string, string][];

  return (
    <div className={`${compact ? "items-center bg-gray-50 px-4 py-3 text-center" : "px-5 py-4 sm:px-8"} flex flex-col max-w-full`}>
      {hasSheetArea ? (
        <div className={`grid w-full grid-cols-2 ${compact ? "gap-4" : "gap-5"} text-center`}>
          <div className="flex flex-col gap-1">
            <span className={`${compact ? "text-[10px]" : "text-[11px]"} font-bold text-gray-500`}>Площадь</span>
            <span className={`${compact ? "text-[15px]" : "text-lg"} font-bold text-gray-900`}>
              {formatArea(result.area ?? 0)} м2
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className={`${compact ? "text-[10px]" : "text-[11px]"} font-bold text-gray-500`}>Вес</span>
            <span className={`${compact ? "text-[15px]" : "text-lg"} font-bold text-gray-900`}>
              {formatWeight(sheetWeight ?? 0)} кг.
            </span>
          </div>
        </div>
      ) : (
        <div className={`flex flex-col ${compact ? "gap-0.5" : "gap-1"} max-w-full`}>
          <span className={`${compact ? "text-[10px]" : "text-[11px]"} font-bold tracking-widest uppercase text-gray-500`}>
            Результат расчёта
          </span>
          <div className={`flex flex-wrap items-baseline ${compact ? "justify-center" : ""} gap-x-2 gap-y-1 w-full min-w-0`}>
            <span className={`${compact ? "text-xl" : "text-[clamp(1.75rem,9vw,2.5rem)] lg:text-5xl"} min-w-0 font-bold tracking-tight text-gray-900 break-words`}>
              {formatNumber(result.value)}
            </span>
            <span className={`${compact ? "text-sm" : "text-sm sm:text-base lg:text-lg"} font-bold text-gray-500 shrink-0`}>
              {result.unit}
            </span>
          </div>
        </div>
      )}

      {!compact && rows.length > 0 && (
        <dl className="mt-5 grid grid-cols-1 gap-2 text-[12px]">
          {rows.map(([label, value]) => (
            <div key={label} className="flex items-center justify-between gap-3 rounded-lg bg-gray-50 px-3 py-2">
              <dt className="font-semibold text-gray-500">{label}</dt>
              <dd className="text-right font-bold text-gray-900">{value}</dd>
            </div>
          ))}
        </dl>
      )}

      {!compact && (
        <p className="text-[10px] sm:text-[11px] font-medium text-gray-500 mt-3 sm:mt-4 leading-relaxed max-w-full break-words">
          Теоретический расчёт по плотности выбранной марки. Фактическая масса может отличаться из-за допусков проката.
        </p>
      )}
    </div>
  );
};
