"use client";
import React, { useRef } from "react";
import { useMetalCalculator } from "@/hooks/useMetalCalculator";
import { PRODUCTS } from "@/lib/metal-calculator/config/products";
import { CALCULATOR_PRESET_MAP } from "@/lib/metal-calculator/config/presets";
import { MaterialCode, ProductCode } from "@/lib/metal-calculator/types";
import { SelectionBlocks } from "./SelectionBlocks";
import { CalculatorForm } from "./CalculatorForm";
import { CalculatorResult } from "./CalculatorResult";
import { ProfileSchema } from "./ProfileSchema";
import { PresetPicker } from "./PresetPicker";

interface MetalCalculatorProps {
  defaultMaterial?: MaterialCode;
  defaultProduct?: ProductCode;
  onCalculated?: (result: number) => void;
  onSubmitRequest?: (data: unknown) => void;
}

export const MetalCalculator = ({
  defaultMaterial,
  defaultProduct,
  onCalculated
}: MetalCalculatorProps) => {
  const {
    inputs,
    result,
    errors,
    activePresetId,
    handleInputChange,
    setMaterial,
    setProduct,
    setMode,
    applyPreset
  } = useMetalCalculator({ defaultMaterial, defaultProduct, onCalculated });

  const productConfig = PRODUCTS[inputs.product];
  const currentPreset = activePresetId ? CALCULATOR_PRESET_MAP[activePresetId] : null;
  const mobileResultRef = useRef<HTMLDivElement>(null);

  const handleMobileCalculate = () => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    mobileResultRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  };

  return (
    <>
      <div className="md:hidden w-full max-w-full">
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 p-3">
            <h2 className="text-[14px] font-bold leading-tight text-gray-900">
              Расчет веса ({productConfig.label.toLowerCase()})
            </h2>
            <PresetPicker
              compact
              value={activePresetId}
              onChange={(presetId) => applyPreset(presetId ? CALCULATOR_PRESET_MAP[presetId] : null)}
            />

            <SelectionBlocks
              variant="selects"
              currentMaterial={inputs.material}
              currentProduct={inputs.product}
              onMaterialChange={setMaterial}
              onProductChange={setProduct}
            />

            <CalculatorForm
              compact
              productConfig={productConfig}
              mode={inputs.mode}
              inputs={inputs}
              errors={errors}
              onInputChange={handleInputChange}
              onModeChange={setMode}
            />

            <details className="group rounded-lg border border-gray-200 bg-gray-50">
              <summary className="flex min-h-9 cursor-pointer list-none items-center justify-between px-3 text-[12px] font-bold text-gray-700">
                <span>Схема профиля</span>
                <span className="text-gray-400 transition-transform group-open:rotate-180">⌄</span>
              </summary>
              <div className="h-36 border-t border-gray-200 bg-white">
                <ProfileSchema type={productConfig.code} />
              </div>
            </details>

            <button
              type="button"
              onClick={handleMobileCalculate}
              className="h-11 w-full rounded-lg bg-brand-primary text-[12px] font-bold uppercase tracking-[0.18em] text-white shadow-sm transition-colors hover:bg-brand-primary/90 active:scale-[0.99]"
            >
              Рассчитать
            </button>
          </div>

          <div ref={mobileResultRef}>
            <CalculatorResult compact result={result} />
          </div>
        </div>
      </div>

      <div className="hidden md:flex flex-col xl:flex-row gap-4 sm:gap-6 xl:gap-8 w-full max-w-full">
        <div className="w-full xl:w-[300px] shrink-0 bg-gray-50 rounded-2xl sm:rounded-[28px] p-4 sm:p-6 border border-gray-100/50 flex flex-col gap-5 sm:gap-6">
          <PresetPicker
            value={activePresetId}
            onChange={(presetId) => applyPreset(presetId ? CALCULATOR_PRESET_MAP[presetId] : null)}
          />

          <SelectionBlocks
            currentMaterial={inputs.material}
            currentProduct={inputs.product}
            onMaterialChange={setMaterial}
            onProductChange={setProduct}
          />
        </div>

        <div className="flex-1 flex flex-col gap-5 sm:gap-8 min-w-0 max-w-full">
          <div className="flex flex-col lg:flex-row gap-5 sm:gap-8 flex-1 min-w-0">
            <div className="flex-1 flex flex-col min-w-0 sm:pt-2">
              <h2 className="text-sm font-bold tracking-tight text-gray-900 mb-3 sm:mb-6 truncate">
                Расчет веса ({productConfig.label.toLowerCase()})
              </h2>
              <div className="flex min-h-[180px] sm:min-h-[250px] lg:flex-1 items-center justify-center p-0 rounded-2xl sm:rounded-[28px] overflow-hidden bg-white border border-gray-100 lg:border-0">
                <ProfileSchema type={productConfig.code} />
              </div>
            </div>

            <div className="w-full lg:w-[320px] xl:w-[340px] shrink-0 flex flex-col sm:pt-2">
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-500 mb-6">
                Параметры ГОСТ
              </h2>
              <div className="bg-white border border-gray-100 rounded-2xl sm:rounded-[28px] p-4 sm:p-7 shadow-sm flex flex-col gap-6 sm:gap-8 h-full max-w-full">
                {currentPreset && (
                  <div className="rounded-2xl border border-blue-100 bg-blue-50/70 px-4 py-3 text-[12px] leading-relaxed text-gray-600">
                    <span className="font-bold text-gray-900">{currentPreset.title}</span>
                    <span className="ml-2">Справочный вес: {currentPreset.weightDisplay}</span>
                  </div>
                )}
                <CalculatorForm
                  productConfig={productConfig}
                  mode={inputs.mode}
                  inputs={inputs}
                  errors={errors}
                  onInputChange={handleInputChange}
                  onModeChange={setMode}
                />
                <div className="mt-auto basis-full lg:basis-auto flex flex-col justify-end">
                  <CalculatorResult result={result} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
