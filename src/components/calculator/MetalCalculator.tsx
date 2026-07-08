"use client";
import React, { useState } from "react";
import { useMetalCalculator } from "@/hooks/useMetalCalculator";
import { useCalcHistory, CalcHistoryEntry } from "@/hooks/useCalcHistory";
import { CALCULATOR_PRESETS } from "@/lib/metal-calculator/config/presets";
import { MATERIAL_LIST, getGradesByMaterial } from "@/lib/metal-calculator/config/materials";
import { PRODUCT_LIST, PRODUCTS } from "@/lib/metal-calculator/config/products";
import { getSections, isSectionProduct } from "@/lib/metal-calculator/config/sections";
import { CalculationInputs, CalculatorPreset, MaterialCode, MaterialGradeCode, ProductCode } from "@/lib/metal-calculator/types";
import { CalculatorForm } from "./CalculatorForm";
import { CalculatorResult } from "./CalculatorResult";
import { ProductDiagram } from "./ProductDiagram";
import { useOrderModal } from "@/context/ModalContext";

interface MetalCalculatorProps {
  defaultMaterial?: MaterialCode;
  defaultProduct?: ProductCode;
  onCalculated?: (result: number) => void;
  onSubmitRequest?: (data: unknown) => void;
}

const MATERIAL_LABELS: Partial<Record<MaterialCode, string>> = {
  steel: "Черный",
  stainless: "Нержавейка",
};

const formatNumber = (value?: number) => value?.toString().replace(".", ",") ?? "";

const getPresetShortLabel = (preset: CalculatorPreset) => {
  const { productCode, presetValues } = preset;

  if (productCode === "rebar") return `Ø${formatNumber(presetValues.diameter)}`;
  if (productCode === "rod") return `Ø${formatNumber(presetValues.diameter)} A-I`;
  if (productCode === "pipe_profile") {
    return `${formatNumber(presetValues.sideA)}×${formatNumber(presetValues.sideB)}×${formatNumber(presetValues.thickness)}`;
  }
  if (productCode === "pipe_round") {
    return `Ø${formatNumber(presetValues.diameter)}×${formatNumber(presetValues.thickness)}`;
  }
  if (productCode === "sheet") return `${formatNumber(presetValues.thickness)} мм`;
  if (productCode === "angle") {
    return `${formatNumber(presetValues.sideA)}×${formatNumber(presetValues.sideB)}×${formatNumber(presetValues.thickness)}`;
  }
  if (productCode === "channel") return `№${formatNumber((presetValues.sideA ?? 0) / 10)}`;

  return preset.title;
};

const SORTAMENT_ORDER: ProductCode[] = [
  "rebar",
  "rod",
  "pipe_profile",
  "pipe_round",
  "sheet",
  "angle",
  "channel",
  "beam",
];

const formatDims = (inputs: CalculationInputs): string => {
  const v = inputs.values;
  if (inputs.section) return ""; // номер уже в названии («Швеллер №10У»)
  switch (inputs.product) {
    case "pipe_round": return `Ø${fmtNum(v.diameter)}×${fmtNum(v.thickness)}`;
    case "pipe_profile": return `${fmtNum(v.sideA)}×${fmtNum(v.sideB)}×${fmtNum(v.thickness)}`;
    case "sheet":
    case "strip": return `${fmtNum(v.thickness)}×${fmtNum(v.width)}`;
    case "rod":
    case "rebar": return `Ø${fmtNum(v.diameter)}`;
    case "square": return `${fmtNum(v.sideA)}`;
    case "hex": return `S${fmtNum(v.diameter)}`;
    case "angle":
    case "channel": return `${fmtNum(v.sideA)}×${fmtNum(v.sideB)}×${fmtNum(v.thickness)}`;
    default: return "";
  }
};

const fmtNum = (value?: number) =>
  value === undefined || Number.isNaN(value) ? "?" : value.toLocaleString("ru-RU", { maximumFractionDigits: 2 });

export const MetalCalculator = ({
  defaultMaterial,
  defaultProduct,
  onCalculated,
}: MetalCalculatorProps) => {
  const {
    inputs,
    result,
    draftResult,
    errors,
    activePresetId,
    handleInputChange,
    setMaterial,
    setGrade,
    setProduct,
    setSection,
    setMode,
    calculate,
    applyPreset,
    restoreInputs,
  } = useMetalCalculator({ defaultMaterial, defaultProduct, onCalculated });

  const { entries: history, addEntry, removeEntry, clearHistory } = useCalcHistory();
  const [historyOpen, setHistoryOpen] = useState(false);
  const { openModal } = useOrderModal();

  // Хук-конверсия: заявка с готовой номенклатурой из расчёта
  const orderFromResult = () => {
    const dims = formatDims(inputs);
    const summary = [
      result.productName,
      dims,
      inputs.mode === "weight_by_dimensions"
        ? `L = ${fmtNum(inputs.values.length)} м — ${fmtNum(result.value)} кг`
        : `${fmtNum(inputs.values.weight)} кг — ${fmtNum(result.value)} м`,
    ]
      .filter(Boolean)
      .join(", ");
    openModal({
      productLabel: summary,
      materialName: [result.materialName, result.gradeName].filter(Boolean).join(" "),
    });
  };

  const resultCta = result.isCalculated && !result.error && (
    <div className="flex flex-col items-center gap-1.5 px-5 pb-5 sm:px-8">
      <button
        type="button"
        onClick={orderFromResult}
        className="h-11 w-full max-w-[360px] rounded-xl bg-brand-accent text-[12px] font-bold uppercase tracking-[0.14em] text-white shadow-sm transition-all hover:brightness-110 active:scale-[0.99]"
      >
        Узнать цену на этот металл
      </button>
      <span className="text-[11px] font-medium text-gray-400">
        Расчёт подставится в заявку — менеджер ответит с ценой за 30 минут
      </span>
    </div>
  );

  const handleCalculate = () => {
    if (draftResult.isCalculated && !draftResult.error) {
      const title = [draftResult.productName, formatDims(inputs), draftResult.gradeName]
        .filter(Boolean)
        .join(" · ");
      const resultText =
        inputs.mode === "weight_by_dimensions"
          ? `${fmtNum(draftResult.value)} кг (L = ${fmtNum(inputs.values.length)} м)`
          : `${fmtNum(draftResult.value)} м (${fmtNum(inputs.values.weight)} кг)`;
      addEntry({ title, result: resultText, inputs });
    }
    calculate();
  };

  const restoreFromHistory = (entry: CalcHistoryEntry) => {
    restoreInputs(entry.inputs);
    setHistoryOpen(false);
  };

  const productConfig = PRODUCTS[inputs.product];
  const gradeList = getGradesByMaterial(inputs.material);
  const activePreset = CALCULATOR_PRESETS.find((preset) => preset.id === activePresetId);
  const title = activePreset?.title ?? productConfig.label;
  const gradeLabel = inputs.material === "steel" ? "Марка стали" : "Марка / сплав";
  const presetGroups = SORTAMENT_ORDER.map((productCode) => ({
    product: PRODUCTS[productCode],
    items: CALCULATOR_PRESETS.filter((preset) => preset.productCode === productCode),
  })).filter((group) => group.items.length > 0);
  const remainingPresetGroups = PRODUCT_LIST
    .filter((product) => !SORTAMENT_ORDER.includes(product.code))
    .map((product) => ({
      product,
      items: CALCULATOR_PRESETS.filter((preset) => preset.productCode === product.code),
    }))
    .filter((group) => group.items.length > 0);
  const allPresetGroups = [...presetGroups, ...remainingPresetGroups];
  // Табличный прокат (двутавр) попадает в список сортамента без пресетов
  SORTAMENT_ORDER.forEach((productCode) => {
    if (isSectionProduct(productCode) && !allPresetGroups.some((group) => group.product.code === productCode)) {
      allPresetGroups.push({ product: PRODUCTS[productCode], items: [] });
    }
  });
  const activeGroupItems = CALCULATOR_PRESETS.filter((preset) => preset.productCode === inputs.product);
  const activePresetValue = activePresetId && activeGroupItems.some((preset) => preset.id === activePresetId)
    ? activePresetId
    : "";
  const sectionList = getSections(inputs.product);
  const isTableProduct = sectionList.length > 0;
  const applyProductOnMobile = (productCode: ProductCode) => {
    // Номера двутавра/швеллера нормированы по ГОСТ для стали
    if (isSectionProduct(productCode)) {
      if (inputs.material !== "steel") setMaterial("steel");
      setProduct(productCode);
      return;
    }

    const firstPreset = CALCULATOR_PRESETS.find((preset) => preset.productCode === productCode);

    if (firstPreset) {
      applyPreset(firstPreset);
      return;
    }

    setProduct(productCode);
  };

  const sectionSelect = (compact: boolean) => (
    <label className="flex flex-col gap-1.5">
      <span className={`${compact ? "text-[13px]" : "text-[13px]"} font-bold text-gray-950`}>
        Номер по ГОСТ
      </span>
      <select
        value={inputs.section ?? ""}
        onChange={(event) => setSection(event.target.value)}
        className={`${compact ? "h-10 text-[13px]" : "h-10 text-[14px] font-semibold"} w-full rounded-xl bg-gray-50 px-3 font-medium text-gray-900 outline-none focus:bg-white focus:ring-4 focus:ring-brand-primary/10`}
      >
        {!inputs.section && <option value="">Выберите номер</option>}
        {sectionList.map((section) => (
          <option key={section.code} value={section.code}>
            {section.label} — {section.kgm.toLocaleString("ru-RU")} кг/м
          </option>
        ))}
      </select>
      {inputs.product === "channel" && !inputs.section && (
        <span className="text-[11px] font-medium text-gray-400">
          Или задайте размеры вручную ниже — расчёт по формуле
        </span>
      )}
    </label>
  );

  const historyPanel = (compact: boolean) => (
    <div className={`${compact ? "px-4 py-4" : "px-5 py-4 sm:px-8"} border-t border-gray-100 bg-white`}>
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setHistoryOpen((open) => !open)}
          className="inline-flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-widest text-gray-500 transition-colors hover:text-brand-primary"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
            <path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" /><path d="M12 7v5l3 3" />
          </svg>
          История расчётов{history.length > 0 ? ` (${history.length})` : ""}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className={`transition-transform ${historyOpen ? "rotate-180" : ""}`} aria-hidden>
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
        {historyOpen && history.length > 0 && (
          <button
            type="button"
            onClick={clearHistory}
            className="text-[11px] font-semibold text-gray-400 transition-colors hover:text-red-500"
          >
            Очистить всё
          </button>
        )}
      </div>

      {historyOpen && (
        history.length === 0 ? (
          <p className="mt-3 text-[12px] font-medium text-gray-400">
            Пока пусто — нажмите «Рассчитать», и расчёт сохранится здесь.
          </p>
        ) : (
          <ul className="mt-3 flex flex-col gap-1.5">
            {history.map((entry) => (
              <li key={entry.id} className="group flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => restoreFromHistory(entry)}
                  title="Подставить этот расчёт в калькулятор"
                  className="flex min-w-0 flex-1 flex-col rounded-xl bg-gray-50 px-3 py-2 text-left transition-colors hover:bg-brand-primary/10"
                >
                  <span className="truncate text-[12px] font-semibold text-gray-900">{entry.title}</span>
                  <span className="text-[12px] font-bold text-brand-primary">{entry.result}</span>
                </button>
                <button
                  type="button"
                  onClick={() => removeEntry(entry.id)}
                  aria-label="Удалить из истории"
                  className="shrink-0 rounded-xl p-1.5 text-gray-300 transition-colors hover:bg-gray-100 hover:text-red-500"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )
      )}
    </div>
  );

  return (
    <>
    <section className="mx-auto w-full max-w-[360px] overflow-hidden rounded-xl bg-white shadow-sm lg:hidden">
      <div className="px-4 py-4">
        <div className="mb-3">
          <h2 className="text-[14px] font-bold leading-tight text-gray-950">
            {inputs.mode === "weight_by_dimensions" ? "Расчет веса" : "Расчет длины"}: {productConfig.label}
          </h2>
        </div>

        <div className="mb-4 flex rounded-xl bg-gray-100 p-1 text-[12px]">
          <button
            type="button"
            onClick={() => setMode("weight_by_dimensions")}
            className={`h-8 flex-1 rounded-sm font-medium transition-colors ${
              inputs.mode === "weight_by_dimensions" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"
            }`}
          >
            Расчет веса
          </button>
          <button
            type="button"
            onClick={() => setMode("length_by_weight")}
            className={`h-8 flex-1 rounded-sm font-medium transition-colors ${
              inputs.mode === "length_by_weight" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"
            }`}
          >
            Расчет длины
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <label className="flex flex-col gap-1">
            <span className="text-[13px] font-bold text-gray-950">Металл</span>
            <select
              value={inputs.material}
              onChange={(event) => setMaterial(event.target.value as MaterialCode)}
              className="h-10 w-full rounded-xl bg-gray-50 px-3 text-[13px] font-medium text-gray-900 outline-none focus:bg-white focus:ring-4 focus:ring-brand-primary/10"
            >
              {MATERIAL_LIST.map((material) => (
                <option key={material.code} value={material.code}>
                  {MATERIAL_LABELS[material.code] ?? material.name}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-[13px] font-bold text-gray-950">Сортамент</span>
            <select
              value={inputs.product}
              onChange={(event) => applyProductOnMobile(event.target.value as ProductCode)}
              className="h-10 w-full rounded-xl bg-gray-50 px-3 text-[13px] font-medium text-gray-900 outline-none focus:bg-white focus:ring-4 focus:ring-brand-primary/10"
            >
              {allPresetGroups.map((group) => (
                <option key={group.product.code} value={group.product.code}>
                  {group.product.label}
                </option>
              ))}
            </select>
          </label>

          {isTableProduct
            ? sectionSelect(true)
            : activeGroupItems.length > 0 && inputs.product !== "rebar" && (
            <label className="flex flex-col gap-1">
              <span className="text-[13px] font-bold text-gray-950">Позиция</span>
              <select
                value={activePresetValue}
                onChange={(event) => {
                  const preset = CALCULATOR_PRESETS.find((item) => item.id === event.target.value);
                  if (preset) applyPreset(preset);
                }}
                className="h-10 w-full rounded-xl bg-gray-50 px-3 text-[13px] font-medium text-gray-900 outline-none focus:bg-white focus:ring-4 focus:ring-brand-primary/10"
              >
                {!activePresetValue && <option value="">Выберите позицию</option>}
                {activeGroupItems.map((preset) => (
                  <option key={preset.id} value={preset.id}>
                    {getPresetShortLabel(preset)}
                  </option>
                ))}
              </select>
            </label>
          )}

          <label className="flex flex-col gap-1">
            <span className="text-[13px] font-bold text-gray-950">{gradeLabel}</span>
            <select
              value={inputs.grade ?? ""}
              onChange={(event) => setGrade(event.target.value as MaterialGradeCode)}
              className="h-10 w-full rounded-xl bg-gray-50 px-3 text-[13px] font-medium text-gray-900 outline-none focus:bg-white focus:ring-4 focus:ring-brand-primary/10"
            >
              {gradeList.map((grade) => (
                <option key={grade.code} value={grade.code}>
                  {grade.name}
                </option>
              ))}
            </select>
          </label>

          <div className="flex justify-center">
            <ProductDiagram compact product={inputs.product} values={inputs.values} />
          </div>

          <CalculatorForm
            compact
            productConfig={productConfig}
            mode={inputs.mode}
            inputs={inputs}
            errors={errors}
            onInputChange={handleInputChange}
          />

          <button
            type="button"
            onClick={handleCalculate}
            className="mt-2 h-11 w-full rounded-xl bg-brand-primary text-[12px] font-bold uppercase tracking-[0.16em] text-white shadow-sm transition-colors hover:bg-brand-primary/90 active:scale-[0.99]"
          >
            Рассчитать
          </button>
        </div>
      </div>

      {(result.isCalculated || result.error) && (
        <div className="bg-gray-50">
          <CalculatorResult compact result={result} />
          {resultCta}
        </div>
      )}

      {historyPanel(true)}
    </section>

    <section className="mx-auto hidden w-full max-w-[1040px] overflow-hidden rounded-xl bg-white shadow-sm lg:block">
      <div className="grid grid-cols-1 lg:min-h-[560px] lg:grid-cols-[132px_316px_1fr]">
        <aside className="bg-white">
          <div className="px-4 pt-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 lg:py-3 lg:text-[11px]">
            Металл
          </div>
          <div className="flex gap-2 overflow-x-auto px-4 pb-4 pt-3 lg:block lg:overflow-visible lg:px-0 lg:py-0">
            {MATERIAL_LIST.map((material) => {
              const isActive = material.code === inputs.material;

              return (
                <button
                  key={material.code}
                  type="button"
                  onClick={() => setMaterial(material.code)}
                  className={`shrink-0 rounded-xl px-3.5 py-2 text-left text-[12px] font-semibold transition-colors lg:block lg:w-full lg:rounded-none lg:px-4 lg:py-3 lg:text-[13px] lg:font-medium ${
                    isActive
                      ? "bg-brand-primary/10 text-brand-primary"
                      : "bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-900 lg:bg-transparent lg:hover:bg-gray-50"
                  }`}
                >
                  {MATERIAL_LABELS[material.code] ?? material.name}
                </button>
              );
            })}
          </div>
        </aside>

        <aside className="bg-gray-50/70">
          <div className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 lg:text-[11px]">
            <span>Сортамент</span>
          </div>
          <div className="max-h-[300px] space-y-1 overflow-y-auto px-3 py-3 sm:max-h-[340px] lg:max-h-[520px]">
            {allPresetGroups.map((group) => (
              <button
                key={group.product.code}
                type="button"
                onClick={() => applyProductOnMobile(group.product.code)}
                className={`block w-full rounded-xl px-3 py-2.5 text-left text-[13px] font-semibold transition-colors ${
                  inputs.product === group.product.code
                    ? "bg-brand-primary/10 text-brand-primary"
                    : "text-gray-600 hover:bg-white hover:text-gray-900"
                }`}
              >
                {group.product.label}
              </button>
            ))}
          </div>
        </aside>

        <div className="flex min-w-0 flex-col">
          <div className="flex-1 px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between lg:mb-5">
              <h2 className="text-[14px] font-bold leading-snug tracking-tight text-gray-900 sm:text-[15px]">
                {inputs.mode === "weight_by_dimensions" ? "Расчет веса" : "Расчет длины"}: {title}
              </h2>
              <div className="flex w-full rounded-xl bg-gray-100 p-1 text-[12px] sm:w-[228px]">
                <button
                  type="button"
                  onClick={() => setMode("weight_by_dimensions")}
                  className={`h-8 flex-1 rounded-xl font-semibold transition-colors ${
                    inputs.mode === "weight_by_dimensions" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"
                  }`}
                >
                  Расчет веса
                </button>
                <button
                  type="button"
                  onClick={() => setMode("length_by_weight")}
                  className={`h-8 flex-1 rounded-xl font-semibold transition-colors ${
                    inputs.mode === "length_by_weight" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"
                  }`}
                >
                  Расчет длины
                </button>
              </div>
            </div>

            <div className="mb-3 flex flex-col gap-1.5 sm:mb-4">
              <label className="text-[13px] font-bold text-gray-900">{gradeLabel}</label>
              <select
                value={inputs.grade ?? ""}
                onChange={(event) => setGrade(event.target.value as MaterialGradeCode)}
                className="h-10 w-full rounded-xl bg-gray-50 px-3 text-[14px] font-semibold text-gray-900 outline-none transition-colors focus:bg-white focus:ring-4 focus:ring-brand-primary/10"
              >
                {gradeList.map((grade) => (
                  <option key={grade.code} value={grade.code}>
                    {grade.name}
                  </option>
                ))}
              </select>
            </div>

            {isTableProduct ? (
              <div className="mb-3 sm:mb-4">{sectionSelect(false)}</div>
            ) : activeGroupItems.length > 0 && inputs.product !== "rebar" && (
              <div className="mb-3 flex flex-col gap-1.5 sm:mb-4">
                <label className="text-[13px] font-bold text-gray-900">Позиция</label>
                <select
                  value={activePresetValue}
                  onChange={(event) => {
                    const preset = CALCULATOR_PRESETS.find((item) => item.id === event.target.value);
                    if (preset) applyPreset(preset);
                  }}
                  className="h-10 w-full rounded-xl bg-gray-50 px-3 text-[14px] font-semibold text-gray-900 outline-none transition-colors focus:bg-white focus:ring-4 focus:ring-brand-primary/10"
                >
                  {!activePresetValue && <option value="">Выберите позицию</option>}
                  {activeGroupItems.map((preset) => (
                    <option key={preset.id} value={preset.id}>
                      {getPresetShortLabel(preset)}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex items-start gap-6">
              <div className="hidden shrink-0 pt-6 lg:block">
                <ProductDiagram product={inputs.product} values={inputs.values} />
              </div>
              <div className="min-w-0 flex-1">
                <CalculatorForm
                  compact
                  productConfig={productConfig}
                  mode={inputs.mode}
                  inputs={inputs}
                  errors={errors}
                  onInputChange={handleInputChange}
                />

                <button
                  type="button"
                  onClick={handleCalculate}
                  className="mt-4 h-12 w-full rounded-xl bg-brand-primary text-[12px] font-bold uppercase tracking-[0.16em] text-white shadow-sm transition-colors hover:bg-brand-primary/90 active:scale-[0.99] sm:mt-5 sm:h-11"
                >
                  Рассчитать
                </button>
              </div>
            </div>
          </div>

          {(result.isCalculated || result.error) && (
            <div className="bg-gray-50/70">
              <CalculatorResult result={result} />
              {resultCta}
            </div>
          )}

          {historyPanel(false)}
        </div>
      </div>
    </section>
    </>
  );
};
