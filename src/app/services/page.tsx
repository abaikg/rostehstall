"use client";
import React from "react";
import Link from "next/link";
import { services } from "@/data/services";
import { useOrderModal } from "@/context/ModalContext";

const ChevronRight = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
    <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SERVICE_ICONS = [
  // Лазерная резка
  <svg key="laser" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" />
  </svg>,
  // Рубка и гибка
  <svg key="bend" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18M3 12h18M3 18h18" />
    <path d="M7 3v18" />
  </svg>,
  // Сварка
  <svg key="weld" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M9 12l2 2 4-4" />
  </svg>,
  // Логистика
  <svg key="truck" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 3h15v13H1z" />
    <path d="M16 8h4l3 3v5h-7V8z" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </svg>,
];

const HIGHLIGHTS = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    label: "Гарантия качества",
    desc: "Все работы выполняются по ГОСТ с контролем ОТК на каждом этапе.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" />
      </svg>
    ),
    label: "Срок от 1 дня",
    desc: "Стандартные заказы выполняем за 1 рабочий день. Срочные — в течение смены.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    label: "Опытная команда",
    desc: "Сварщики с аттестацией НАКС, операторы ЧПУ с опытом от 5 лет.",
  },
];

export default function ServicesPage() {
  const { openModal } = useOrderModal();

  return (
    <div className="flex flex-col pb-24">

      {/* ── Шапка ── */}
      <div className="pt-8 sm:pt-12 pb-8 border-b border-gray-100">
        <div className="container">
          <nav className="flex items-center gap-1.5 text-[12px] font-semibold text-gray-400">
            <Link href="/" className="hover:text-gray-700 transition-colors">Главная</Link>
            <ChevronRight />
            <span className="text-gray-700">Услуги</span>
          </nav>
        </div>
      </div>

      {/* ── Карточки услуг ── */}
      <div className="py-16 sm:py-20">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {services.map((service, i) => (
              <div
                key={i}
                className="group relative bg-white border border-gray-200 hover:border-gray-300 hover:shadow-lg rounded-xl p-8 sm:p-10 flex flex-col gap-6 transition-all duration-200"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="w-14 h-14 rounded-xl bg-blue-50 text-brand-primary flex items-center justify-center shrink-0 group-hover:bg-brand-primary group-hover:text-white transition-all duration-200">
                    {SERVICE_ICONS[i]}
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-gray-300 group-hover:text-brand-primary/50 transition-colors pt-1">
                    0{i + 1}
                  </span>
                </div>

                <div className="flex flex-col gap-3">
                  <h2 className="text-[20px] sm:text-[22px] font-bold text-gray-900 tracking-tight leading-snug">
                    {service.title}
                  </h2>
                  <p className="text-[14px] sm:text-[15px] text-gray-500 leading-relaxed">
                    {service.desc}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 mt-auto pt-2">
                  {service.features.map((f, fi) => (
                    <span
                      key={fi}
                      className="inline-flex items-center px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-200 text-[12px] font-semibold text-gray-600"
                    >
                      {f}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => openModal()}
                  className="self-start inline-flex items-center gap-2 text-brand-primary font-semibold text-[13px] hover:gap-3 transition-all"
                >
                  Заказать услугу
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                    <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Преимущества ── */}
      <div className="border-t border-gray-100 py-16 sm:py-20">
        <div className="container flex flex-col gap-10">
          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-bold uppercase tracking-widest text-brand-primary">Почему мы</span>
            <h2 className="text-[26px] sm:text-[34px] font-bold tracking-tight text-gray-900">
              Работаем на результат
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {HIGHLIGHTS.map((h, i) => (
              <div key={i} className="flex flex-col gap-4 p-6 bg-white border border-gray-200 rounded-xl">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-brand-primary flex items-center justify-center">
                  {h.icon}
                </div>
                <div className="flex flex-col gap-1.5">
                  <p className="text-[15px] font-bold text-gray-900">{h.label}</p>
                  <p className="text-[13px] text-gray-500 leading-relaxed">{h.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="container">
        <div className="relative overflow-hidden bg-[#0d1117] rounded-xl p-10 sm:p-14 flex flex-col sm:flex-row items-center justify-between gap-8">
          <div className="pointer-events-none absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4" />
          <div className="flex flex-col gap-3 z-10 text-center sm:text-left">
            <h2 className="text-[24px] sm:text-[32px] font-bold text-white tracking-tight">
              Нужен расчёт стоимости работ?
            </h2>
            <p className="text-[14px] sm:text-[15px] text-gray-400 max-w-md leading-relaxed">
              Оставьте заявку — менеджер свяжется с вами в течение 30 минут и подготовит коммерческое предложение.
            </p>
          </div>
          <div className="z-10 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button
              onClick={() => openModal()}
              className="inline-flex items-center justify-center bg-brand-primary hover:bg-brand-primary/90 active:scale-[0.98] text-white font-semibold text-[14px] px-7 py-3.5 rounded-xl shadow-lg shadow-brand-primary/25 transition-all"
            >
              Оставить заявку
            </button>
            <Link
              href="/contacts"
              className="inline-flex items-center justify-center bg-white/10 hover:bg-white/15 text-white font-semibold text-[14px] px-7 py-3.5 rounded-xl border border-white/10 transition-all"
            >
              Контакты
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
