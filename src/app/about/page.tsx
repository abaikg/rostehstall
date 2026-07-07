"use client";
import React from "react";
import Link from "next/link";
import { useOrderModal } from "@/context/ModalContext";

const ChevronRight = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
    <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const STATS = [
  { value: "10+", label: "лет на рынке" },
  { value: "5 000+", label: "клиентов" },
  { value: "50 000+", label: "тонн поставлено" },
  { value: "1 000+", label: "позиций на складе" },
];

const VALUES = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Качество",
    desc: "Работаем только с сертифицированной продукцией заводов России и Казахстана. Каждая партия проходит входной контроль.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Скорость",
    desc: "Обрабатываем заявки за 30 минут, отгружаем день в день при наличии на складе. Доставка по всему Кыргызстану.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
      </svg>
    ),
    title: "Честные цены",
    desc: "Прямые контракты с заводами исключают наценку посредников. Специальные условия для крупных и постоянных клиентов.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: "Поддержка",
    desc: "Персональный менеджер для каждого клиента. Помогаем с подбором марки стали, расчётом объёма и оформлением документов.",
  },
];

const MILESTONES = [
  { year: "2014", title: "Основание компании", desc: "Открытие первого склада в Бишкеке, первые прямые поставки из России." },
  { year: "2016", title: "Расширение ассортимента", desc: "Добавили трубный прокат и фасонный металл, заключили договоры с 5 заводами." },
  { year: "2018", title: "Развитие логистики", desc: "Запустили оперативную доставку металлопроката по всем регионам КР." },
  { year: "2020", title: "Выход на новые рынки", desc: "Начали поставки в Казахстан и Узбекистан, оборот превысил 1 млрд сом." },
  { year: "2022", title: "Новый складской комплекс", desc: "Открыли современный склад 8 000 м² с автоматизированным учётом и резкой металла." },
  { year: "2024", title: "Развитие и масштабирование", desc: "50 000+ тонн поставлено, более 5 000 постоянных клиентов по всей стране." },
];

export default function AboutPage() {
  const { openModal } = useOrderModal();

  return (
    <div className="flex flex-col pb-24">

      {/* ── Hero ── */}
      <div className="relative overflow-hidden bg-[#0d1117] text-white">
        {/* bg glow */}
        <div className="pointer-events-none absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] -translate-y-1/2" />
        <div className="pointer-events-none absolute bottom-0 right-0 w-80 h-80 bg-brand-primary/10 rounded-full blur-[80px] translate-y-1/3" />

        <div className="container relative z-10 pt-8 sm:pt-14 pb-14 sm:pb-20 flex flex-col gap-6">
          {/* breadcrumb */}
          <nav className="flex items-center gap-1.5 text-[12px] font-semibold text-white/40">
            <Link href="/" className="hover:text-white/70 transition-colors">Главная</Link>
            <ChevronRight />
            <span className="text-white/70">О компании</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-end gap-8 lg:gap-16">
            <div className="flex flex-col gap-5 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/10 text-white/80 text-[11px] font-bold uppercase tracking-widest w-fit">
                Более 3 лет в Кыргызстане
              </div>
              <h1 className="text-[26px] sm:text-[36px] md:text-[48px] font-bold tracking-tight leading-tight">
                Ростехсталь — ведущий поставщик металлопроката в&nbsp;Кыргызстане
              </h1>
              <p className="text-[14px] sm:text-[16px] text-white/60 leading-relaxed max-w-xl">
                Прямые поставки с заводов России и Казахстана, собственный склад 8&nbsp;000&nbsp;м² и быстрая доставка.
              </p>
              <div className="flex flex-wrap gap-3 pt-1">
                <button
                  onClick={openModal}
                  className="inline-flex items-center gap-2 bg-brand-primary hover:bg-brand-primary/90 active:scale-[0.98] text-white font-semibold text-[14px] px-6 py-3 rounded-full shadow-lg shadow-brand-primary/25 transition-all"
                >
                  Связаться с нами
                </button>
                <Link
                  href="/contacts"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white font-semibold text-[14px] px-6 py-3 rounded-full border border-white/10 transition-all"
                >
                  Контакты
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:ml-auto shrink-0">
              {STATS.map((s, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 flex flex-col gap-1 min-w-[130px]">
                  <span className="text-[28px] sm:text-[34px] font-bold text-white tracking-tight leading-none">{s.value}</span>
                  <span className="text-[12px] text-white/50 font-medium">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── О компании ── */}
      <div className="py-16 sm:py-20 border-b border-gray-100">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <span className="text-[11px] font-bold uppercase tracking-widest text-brand-primary">Наша история</span>
                <h2 className="text-[22px] sm:text-[28px] md:text-[34px] font-bold tracking-tight text-gray-900 leading-tight">
                  Более 3 лет строим металлоторговлю в&nbsp;Кыргызстане
                </h2>
              </div>
              <p className="text-[15px] sm:text-[16px] text-gray-700 leading-relaxed">
                «Ростехсталь» — ведущая компания по поставке металлопроката в Кыргызстане. Мы специализируемся на широком ассортименте металлопродукции: стальные листы, трубы, арматура, швеллер, двутавр, уголок и другие изделия.
              </p>
              <p className="text-[14px] sm:text-[15px] text-gray-500 leading-relaxed">
                Прямые контракты с заводами-производителями позволяют предлагать конкурентные цены без посреднических наценок. Собственный склад 8 000 м² обеспечивает постоянное наличие товара. Быстрая доставка гарантирует своевременное получение металла в любой точке Кыргызстана.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <div className="flex items-center gap-2 text-[13px] font-semibold text-gray-700">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 7" /></svg>
                  Сертифицированная продукция
                </div>
                <div className="flex items-center gap-2 text-[13px] font-semibold text-gray-700">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 7" /></svg>
                  Порезка и обработка на складе
                </div>
                <div className="flex items-center gap-2 text-[13px] font-semibold text-gray-700">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 7" /></svg>
                  ЭДО и полный пакет документов
                </div>
                <div className="flex items-center gap-2 text-[13px] font-semibold text-gray-700">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 7" /></svg>
                  Доставка по всему Кыргызстану
                </div>
              </div>
            </div>

            {/* Visual card grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 bg-gradient-to-br from-brand-primary to-blue-700 rounded-2xl p-6 text-white flex flex-col gap-2">
                <span className="text-[42px] font-bold tracking-tight leading-none">50 000+</span>
                <span className="text-[14px] text-white/70 font-medium">тонн металлопроката поставлено клиентам</span>
              </div>
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 flex flex-col gap-1.5">
                <span className="text-[28px] font-bold text-gray-900">8 000</span>
                <span className="text-[12px] text-gray-500 font-medium">м² складских площадей</span>
              </div>
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 flex flex-col gap-1.5">
                <span className="text-[28px] font-bold text-gray-900">24 ч</span>
                <span className="text-[12px] text-gray-500 font-medium">срок доставки по Бишкеку</span>
              </div>
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 flex flex-col gap-1.5">
                <span className="text-[28px] font-bold text-gray-900">30 мин</span>
                <span className="text-[12px] text-gray-500 font-medium">обработка заявки</span>
              </div>
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 flex flex-col gap-1.5">
                <span className="text-[28px] font-bold text-gray-900">5 заводов</span>
                <span className="text-[12px] text-gray-500 font-medium">прямые контракты</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Ценности ── */}
      <div className="py-16 sm:py-20 border-b border-gray-100">
        <div className="container flex flex-col gap-10">
          <div className="flex flex-col gap-2 max-w-xl">
            <span className="text-[11px] font-bold uppercase tracking-widest text-brand-primary">Почему выбирают нас</span>
            <h2 className="text-[22px] sm:text-[28px] md:text-[34px] font-bold tracking-tight text-gray-900">
              Наши принципы работы
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {VALUES.map((v, i) => (
              <div key={i} className="group bg-white border border-gray-200 hover:border-brand-primary/30 hover:shadow-md rounded-2xl p-6 flex flex-col gap-4 transition-all duration-200">
                <div className="w-11 h-11 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white transition-all duration-200">
                  {v.icon}
                </div>
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-[16px] font-bold text-gray-900">{v.title}</h3>
                  <p className="text-[13px] text-gray-500 leading-relaxed">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── История / Timeline ── */}
      <div className="py-16 sm:py-20 border-b border-gray-100">
        <div className="container flex flex-col gap-10">
          <div className="flex flex-col gap-2 max-w-xl">
            <span className="text-[11px] font-bold uppercase tracking-widest text-brand-primary">Наш путь</span>
            <h2 className="text-[22px] sm:text-[28px] md:text-[34px] font-bold tracking-tight text-gray-900">
              Ключевые этапы развития
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {MILESTONES.map((m, i) => (
              <div key={i} className="relative bg-white border border-gray-200 hover:border-gray-300 hover:shadow-sm rounded-2xl p-6 flex flex-col gap-3 transition-all duration-200 overflow-hidden">
                <div className="pointer-events-none absolute top-0 right-0 text-[80px] font-black text-gray-50 leading-none select-none pr-2 pt-1">{m.year}</div>
                <span className="text-[13px] font-bold text-brand-primary">{m.year}</span>
                <h3 className="text-[15px] font-bold text-gray-900">{m.title}</h3>
                <p className="text-[13px] text-gray-500 leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="container pt-16">
        <div className="relative overflow-hidden bg-[#0d1117] rounded-2xl sm:rounded-3xl p-6 sm:p-10 lg:p-14 flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-8">
          <div className="pointer-events-none absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4" />
          <div className="pointer-events-none absolute bottom-0 left-0 w-64 h-64 bg-brand-primary/10 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/4" />
          <div className="flex flex-col gap-3 z-10 text-center sm:text-left">
            <h2 className="text-[20px] sm:text-[26px] lg:text-[30px] font-bold text-white tracking-tight">
              Станьте нашим партнёром
            </h2>
            <p className="text-[13px] sm:text-[14px] text-gray-400 max-w-md leading-relaxed">
              Строительные и промышленные предприятия Кыргызстана доверяют нам уже более 3 лет. Обсудим условия сотрудничества.
            </p>
          </div>
          <div className="z-10 flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0">
            <button
              onClick={openModal}
              className="inline-flex items-center justify-center bg-brand-primary hover:bg-brand-primary/90 active:scale-[0.98] text-white font-semibold text-[14px] px-7 py-3.5 rounded-full shadow-lg shadow-brand-primary/25 transition-all"
            >
              Оставить заявку
            </button>
            <Link
              href="/contacts"
              className="inline-flex items-center justify-center bg-white/10 hover:bg-white/15 text-white font-semibold text-[14px] px-7 py-3.5 rounded-full border border-white/10 transition-all"
            >
              Контакты
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
