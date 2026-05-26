"use client";
import React from "react";
import { useMetalCalculator } from "@/hooks/useMetalCalculator";
import { PRODUCTS } from "@/lib/metal-calculator/config/products";
import { MaterialCode, ProductCode } from "@/lib/metal-calculator/types";
import { SelectionBlocks } from "./SelectionBlocks";
import { CalculatorForm } from "./CalculatorForm";
import { CalculatorResult } from "./CalculatorResult";
import { ProfileSchema } from "./ProfileSchema";

interface MetalCalculatorProps {
  defaultMaterial?: MaterialCode;
  defaultProduct?: ProductCode;
  onCalculated?: (result: number) => void;
  onSubmitRequest?: (data: any) => void;
}

export const MetalCalculator = ({
  defaultMaterial,
  defaultProduct,
  onCalculated,
  onSubmitRequest
}: MetalCalculatorProps) => {
  const {
    inputs,
    result,
    errors,
    handleInputChange,
    setMaterial,
    setProduct,
    setMode,
    reset
  } = useMetalCalculator({ defaultMaterial, defaultProduct, onCalculated });

  const productConfig = PRODUCTS[inputs.product];

  return (
    <div className="flex flex-col xl:flex-row gap-8 w-full max-w-full overflow-hidden">
      {/* 🔴 Левый блок: Навигация (Сайдбар) */}
      <div className="w-full xl:w-[300px] shrink-0 bg-gray-50 rounded-[28px] p-5 sm:p-6 border border-gray-100/50 flex flex-col gap-6 overflow-hidden">
        <SelectionBlocks 
          currentMaterial={inputs.material}
          currentProduct={inputs.product}
          onMaterialChange={setMaterial}
          onProductChange={setProduct}
        />
      </div>

      {/* 🔴 Главная рабочая зона */}
      <div className="flex-1 flex flex-col gap-8 min-w-0 max-w-full overflow-hidden">
         <div className="flex flex-col lg:flex-row gap-8 flex-1 min-w-0">
            
            {/* Центр: Чертеж/Схема */}
            <div className="flex-1 flex flex-col pt-2 min-w-0">
               <h2 className="text-sm font-bold tracking-tight text-gray-900 mb-6 truncate">
                 Расчет веса ({productConfig.label.toLowerCase()})
               </h2>
               <div className="flex-1 min-h-[250px] flex items-center justify-center p-0 rounded-[28px] overflow-hidden bg-white">
                  <ProfileSchema type={productConfig.code} />
               </div>
            </div>

            {/* Право: Характеристики (Inputs) */}
            <div className="w-full lg:w-[320px] xl:w-[340px] shrink-0 pt-2 flex flex-col">
               <h2 className="text-lg sm:text-xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-500 mb-6">Параметры ГОСТ</h2>
               <div className="bg-white border border-gray-100 rounded-[28px] p-5 sm:p-7 shadow-sm flex flex-col gap-8 h-full max-w-full">
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
  );
};
