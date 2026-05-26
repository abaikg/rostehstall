"use client";
import React from "react";
import { MetalCalculator } from "@/components/calculator/MetalCalculator";
import { useOrderModal } from "@/context/ModalContext";

const INFO_ITEMS = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" />
      </svg>
    ),
    title: "Теоретическая масса",
    text: "Расчёт выполняется по формулам ГОСТ с учётом плотности сплава. Погрешность ±3–5% от фактической массы.",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18" />
      </svg>
    ),
    title: "Два режима расчёта",
    text: "Рассчитайте вес по заданной длине или найдите длину прутка по требуемой массе.",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: "ГОСТ-стандарты",
    text: "Все размеры и марки металла соответствуют актуальным стандартам ГОСТ Р.",
  },
];

export default function CalculatorPage() {
  const { openModal } = useOrderModal();

  return (
    <div className="flex flex-col pb-24 pt-6 sm:pt-10">

      {/* ── Калькулятор ── */}
      <div className="container">
        <div className="bg-white border border-gray-200/80 rounded-3xl sm:rounded-[32px] shadow-sm overflow-hidden">
          {/* Верхняя полоска */}
          <div className="flex items-center justify-between px-6 sm:px-8 py-4 border-b border-gray-100 bg-gray-50/60">
            <div className="flex items-center gap-2.5">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-gray-200" />
                <div className="w-3 h-3 rounded-full bg-gray-200" />
                <div className="w-3 h-3 rounded-full bg-gray-200" />
              </div>
              <span className="text-[12px] font-bold text-gray-400 tracking-wide ml-1">
                Расчёт веса / длины
              </span>
            </div>
            <span className="hidden sm:block text-[11px] font-bold uppercase tracking-widest text-gray-400 px-2.5 py-1 bg-gray-100 rounded-full">
              ГОСТ Р
            </span>
          </div>

          {/* Сам калькулятор */}
          <div className="p-4 sm:p-6 lg:p-8">
            <MetalCalculator />
          </div>
        </div>
      </div>

      {/* ── Инфо-блоки ── */}
      <div className="container mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {INFO_ITEMS.map((item, i) => (
            <div key={i} className="flex flex-col gap-3 p-5 sm:p-6 bg-white border border-gray-200 rounded-2xl">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-brand-primary flex items-center justify-center">
                {item.icon}
              </div>
              <h3 className="text-[14px] font-bold text-gray-900">{item.title}</h3>
              <p className="text-[13px] text-gray-500 leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom CTA ── */}
      <div className="container mt-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-5 p-6 sm:p-8 bg-gray-50 border border-gray-200 rounded-2xl">
          <div className="flex flex-col gap-1 text-center sm:text-left">
            <p className="text-[15px] font-bold text-gray-900">Нужно точное коммерческое предложение?</p>
            <p className="text-[13px] text-gray-500">Укажите объём — менеджер рассчитает цену с учётом скидок за 30 минут.</p>
          </div>
          <button
            onClick={openModal}
            className="shrink-0 inline-flex items-center gap-2 bg-brand-primary hover:bg-brand-primary/90 active:scale-[0.98] text-white font-semibold text-[13px] px-6 py-3 rounded-full shadow-sm transition-all"
          >
            Оставить заявку
          </button>
        </div>
      </div>

    </div>
  );
}
