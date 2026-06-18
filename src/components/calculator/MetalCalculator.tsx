"use client";
import React from "react";
import { useMetalCalculator } from "@/hooks/useMetalCalculator";
import { CALCULATOR_PRESETS } from "@/lib/metal-calculator/config/presets";
import { MATERIAL_LIST, getGradesByMaterial } from "@/lib/metal-calculator/config/materials";
import { PRODUCT_LIST, PRODUCTS } from "@/lib/metal-calculator/config/products";
import { CalculatorPreset, MaterialCode, MaterialGradeCode, ProductCode } from "@/lib/metal-calculator/types";
import { CalculatorForm } from "./CalculatorForm";
import { CalculatorResult } from "./CalculatorResult";

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
];

export const MetalCalculator = ({
  defaultMaterial,
  defaultProduct,
  onCalculated,
}: MetalCalculatorProps) => {
  const {
    inputs,
    result,
    errors,
    activePresetId,
    handleInputChange,
    setMaterial,
    setGrade,
    setProduct,
    setMode,
    calculate,
    applyPreset,
  } = useMetalCalculator({ defaultMaterial, defaultProduct, onCalculated });

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
  const activeGroupItems = CALCULATOR_PRESETS.filter((preset) => preset.productCode === inputs.product);
  const activePresetValue = activePresetId && activeGroupItems.some((preset) => preset.id === activePresetId)
    ? activePresetId
    : "";
  const applyProductOnMobile = (productCode: ProductCode) => {
    const firstPreset = CALCULATOR_PRESETS.find((preset) => preset.productCode === productCode);

    if (firstPreset) {
      applyPreset(firstPreset);
      return;
    }

    setProduct(productCode);
  };

  return (
    <>
    <section className="mx-auto w-full max-w-[360px] overflow-hidden rounded-2xl bg-white shadow-sm lg:hidden">
      <div className="px-4 py-4">
        <div className="mb-3">
          <h2 className="text-[14px] font-bold leading-tight text-gray-950">
            {inputs.mode === "weight_by_dimensions" ? "Расчет веса" : "Расчет длины"}: {productConfig.label}
          </h2>
        </div>

        <div className="mb-4 flex rounded-full bg-gray-100 p-1 text-[12px]">
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

          {activeGroupItems.length > 0 && inputs.product !== "rebar" && (
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
            onClick={calculate}
            className="mt-2 h-11 w-full rounded-full bg-brand-primary text-[12px] font-bold uppercase tracking-[0.16em] text-white shadow-sm transition-colors hover:bg-brand-primary/90 active:scale-[0.99]"
          >
            Рассчитать
          </button>
        </div>
      </div>

      {(result.isCalculated || result.error) && (
        <div className="bg-gray-50">
          <CalculatorResult compact result={result} />
        </div>
      )}
    </section>

    <section className="mx-auto hidden w-full max-w-[1040px] overflow-hidden rounded-3xl bg-white shadow-sm lg:block">
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
                  className={`shrink-0 rounded-full px-3.5 py-2 text-left text-[12px] font-semibold transition-colors lg:block lg:w-full lg:rounded-none lg:px-4 lg:py-3 lg:text-[13px] lg:font-medium ${
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
              <div className="flex w-full rounded-full bg-gray-100 p-1 text-[12px] sm:w-[228px]">
                <button
                  type="button"
                  onClick={() => setMode("weight_by_dimensions")}
                  className={`h-8 flex-1 rounded-full font-semibold transition-colors ${
                    inputs.mode === "weight_by_dimensions" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"
                  }`}
                >
                  Расчет веса
                </button>
                <button
                  type="button"
                  onClick={() => setMode("length_by_weight")}
                  className={`h-8 flex-1 rounded-full font-semibold transition-colors ${
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

            {activeGroupItems.length > 0 && inputs.product !== "rebar" && (
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
              onClick={calculate}
              className="mt-4 h-12 w-full rounded-full bg-brand-primary text-[12px] font-bold uppercase tracking-[0.16em] text-white shadow-sm transition-colors hover:bg-brand-primary/90 active:scale-[0.99] sm:mt-5 sm:h-11"
            >
              Рассчитать
            </button>
          </div>

          {(result.isCalculated || result.error) && (
            <div className="bg-gray-50/70">
              <CalculatorResult result={result} />
            </div>
          )}
        </div>
      </div>
    </section>
    </>
  );
};
