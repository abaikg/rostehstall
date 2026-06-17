"use client";
import React, { useState } from "react";
import Link from "next/link";
import { products, CATEGORY_LIST, Product } from "@/data/catalog";
import { ProductCard } from "@/components/features/catalog/ProductCard";
import { useOrderModal } from "@/context/ModalContext";
import { getCategoryPath } from "@/lib/catalogRoutes";

/* ── Иконки категорий ── */
const CategoryIcon = ({ type }: { type: string }) => {
  const cls = "w-5 h-5 shrink-0";
  switch (type) {
    case "pipe": return <svg className={cls} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><circle cx="10" cy="10" r="7"/><circle cx="10" cy="10" r="3.5"/></svg>;
    case "valve": return <svg className={cls} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M4 10h12M10 4v12"/><circle cx="10" cy="10" r="3"/></svg>;
    case "color-metal": return <svg className={cls} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><path d="M3 14 L8 6 L13 14"/><circle cx="15" cy="9" r="3"/></svg>;
    case "sheet": return <svg className={cls} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="14" height="3" rx="0.5"/><rect x="3" y="10" width="14" height="3" rx="0.5"/><rect x="3" y="15" width="10" height="1.5" rx="0.5"/></svg>;
    case "stainless": return <svg className={cls} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><path d="M5 15 L7 5 M10 15 L10 5 M15 15 L13 5"/><path d="M4 8 h12 M4 12 h12"/></svg>;
    case "profile": return <svg className={cls} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 16 L4 5 L10 5"/><path d="M4 16 L14 16"/></svg>;
    case "bars": return <svg className={cls} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><line x1="4" y1="10" x2="16" y2="4"/><line x1="4" y1="13" x2="16" y2="7"/><line x1="4" y1="16" x2="16" y2="10"/></svg>;
    case "cast-iron": return <svg className={cls} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="10" cy="10" r="6"/><path d="M7 10 h6 M10 7 v6"/></svg>;
    case "special": return <svg className={cls} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><polygon points="10,3 17,7.5 17,12.5 10,17 3,12.5 3,7.5"/></svg>;
    case "radiator": return <svg className={cls} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><rect x="3" y="5" width="2.5" height="10" rx="1"/><rect x="7" y="5" width="2.5" height="10" rx="1"/><rect x="11" y="5" width="2.5" height="10" rx="1"/><rect x="15" y="5" width="2" height="10" rx="1"/></svg>;
    case "raw": return <svg className={cls} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><polygon points="10,3 17,15 3,15"/><path d="M7 15 L7 11 M10 15 L10 9 M13 15 L13 11"/></svg>;
    case "pump": return <svg className={cls} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="10" r="5"/><path d="M14 10 h3"/><path d="M3 7 h2 M3 13 h2"/></svg>;
    case "alloy": return <svg className={cls} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4"><circle cx="7" cy="10" r="4.5"/><circle cx="13" cy="10" r="4.5"/></svg>;
    case "cable": return <svg className={cls} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><path d="M3 7 Q7 4 10 7 Q13 10 17 7"/><path d="M3 13 Q7 10 10 13 Q13 16 17 13"/></svg>;
    case "mesh": return <svg className={cls} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"><line x1="4" y1="4" x2="4" y2="16"/><line x1="8" y1="4" x2="8" y2="16"/><line x1="12" y1="4" x2="12" y2="16"/><line x1="16" y1="4" x2="16" y2="16"/><line x1="4" y1="4" x2="16" y2="4"/><line x1="4" y1="8" x2="16" y2="8"/><line x1="4" y1="12" x2="16" y2="12"/><line x1="4" y1="16" x2="16" y2="16"/></svg>;
    case "chrysotile": return <svg className={cls} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><path d="M4 14 L8 6 L12 10 L16 6"/><line x1="4" y1="16" x2="16" y2="16"/></svg>;
    case "gas": return <svg className={cls} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><rect x="7" y="5" width="6" height="11" rx="3"/><path d="M9 5 V4 M11 5 V4"/><path d="M10 16 V17"/></svg>;
    case "insulation": return <svg className={cls} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><circle cx="10" cy="10" r="3"/><circle cx="10" cy="10" r="6" strokeDasharray="2 2"/></svg>;
    case "hardware": return <svg className={cls} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="10" cy="6" r="3"/><path d="M10 9 L10 17"/><path d="M7 13 h6"/></svg>;
    case "fastener": return <svg className={cls} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><line x1="10" y1="3" x2="10" y2="17"/><path d="M7 5 h6 M7 8 h6"/><path d="M8 17 h4"/></svg>;
    case "welding": return <svg className={cls} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><path d="M4 16 L14 6"/><path d="M12 4 L16 8 L14 10"/><path d="M16 14 L18 12 M14 16 L16 14 M12 18 L14 16"/></svg>;
    case "composite": return <svg className={cls} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"><rect x="3" y="5" width="14" height="2.5"/><rect x="3" y="9" width="14" height="2.5"/><rect x="3" y="13" width="14" height="2.5"/></svg>;
    case "powder": return <svg className={cls} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4"><circle cx="6" cy="10" r="1.5"/><circle cx="10" cy="7" r="1.5"/><circle cx="14" cy="10" r="1.5"/><circle cx="10" cy="13" r="1.5"/><circle cx="10" cy="10" r="1"/></svg>;
    case "generator": return <svg className={cls} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="7" width="14" height="9" rx="1.5"/><path d="M7 7 V5 M13 7 V5"/><path d="M8 11 L10 9 L10 12 L12 10"/></svg>;
    case "asbestos": return <svg className={cls} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="6" width="14" height="8" rx="1"/><path d="M7 6 V14 M13 6 V14 M3 10 h14"/></svg>;
    case "rope": return <svg className={cls} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><path d="M4 10 Q7 7 10 10 Q13 13 16 10"/><path d="M4 13 Q7 10 10 13 Q13 16 16 13"/></svg>;
    case "wire": return <svg className={cls} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M3 7 Q6 4 9 7 Q12 10 15 7 Q17 5 18 7"/><path d="M3 13 Q6 10 9 13 Q12 16 15 13 Q17 11 18 13"/></svg>;
    case "polymer": return <svg className={cls} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4"><circle cx="5" cy="10" r="2"/><circle cx="10" cy="6" r="2"/><circle cx="15" cy="10" r="2"/><circle cx="10" cy="14" r="2"/><line x1="7" y1="10" x2="8" y2="10"/><line x1="12" y1="10" x2="13" y2="10"/><line x1="10" y1="8" x2="10" y2="12"/></svg>;
    default: return <svg className={cls} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><rect x="3" y="8" width="14" height="9" rx="1"/><path d="M7 8 V6 a3 3 0 0 1 6 0 V8"/></svg>;
  }
};

const PAGE_SIZE = 12;

export default function CatalogPage() {
  const { openModal } = useOrderModal();
  const [activeCategory, setActiveCategory] = useState("all");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const filteredProducts = activeCategory === "all"
    ? products
    : products.filter((p: Product) =>
        p.category === activeCategory || p.tags?.includes(activeCategory)
      );

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  function selectCategory(cat: string) {
    setActiveCategory(cat);
    setVisibleCount(PAGE_SIZE);
    setMobileMenuOpen(false);
  }

  return (
    <div className="flex flex-col pb-24">

      {/* ── Шапка ── */}
      <div className="pt-8 sm:pt-12 pb-8 border-b border-gray-100">
        <div className="container flex flex-col gap-4">
          <nav className="flex items-center gap-1.5 text-[12px] font-semibold text-gray-400">
            <Link href="/" className="hover:text-gray-700 transition-colors">Главная</Link>
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span className="text-gray-700">Каталог</span>
          </nav>
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <h1 className="text-[22px] sm:text-[28px] md:text-[36px] font-bold tracking-tight text-gray-900">
              Каталог товаров
            </h1>
            <button
              onClick={openModal}
              className="inline-flex items-center gap-2 bg-brand-primary hover:bg-brand-primary/90 text-white font-semibold text-[13px] px-5 py-2.5 rounded-full shadow-sm transition-all active:scale-[0.98]"
            >
              Запросить прайс-лист
            </button>
          </div>
        </div>
      </div>

      {/* ── Основной лейаут ── */}
      <div className="container pt-8 pb-4">
        <div className="flex gap-8 items-start">

          {/* ── Сайдбар (десктоп) ── */}
          <aside className="hidden md:flex flex-col gap-0.5 w-56 lg:w-64 shrink-0 sticky top-[80px]">
            <button
              onClick={() => selectCategory("all")}
              className={`group flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-semibold text-left transition-all ${
                activeCategory === "all"
                  ? "bg-brand-primary text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                <rect x="3" y="3" width="6" height="6" rx="1"/><rect x="11" y="3" width="6" height="6" rx="1"/><rect x="3" y="11" width="6" height="6" rx="1"/><rect x="11" y="11" width="6" height="6" rx="1"/>
              </svg>
              Все категории
            </button>
            <div className="h-px bg-gray-100 my-1.5" />
            {CATEGORY_LIST.map((cat) => {
              const active = activeCategory === cat.name;
              return (
                <Link
                  key={cat.name}
                  href={getCategoryPath(cat.name)}
                  onClick={(event) => {
                    event.preventDefault();
                    selectCategory(cat.name);
                  }}
                  className={`group flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium text-left transition-all ${
                    active
                      ? "bg-brand-primary/10 text-brand-primary font-semibold"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <span className={active ? "text-brand-primary" : "text-gray-400 group-hover:text-gray-600 transition-colors"}>
                    <CategoryIcon type={cat.icon} />
                  </span>
                  <span className="leading-snug">{cat.name}</span>
                </Link>
              );
            })}
          </aside>

          {/* ── Мобильный фильтр ── */}
          <div className="md:hidden w-full flex-none mb-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-xl text-[14px] font-semibold text-gray-800 shadow-sm"
            >
              <span className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 4h12M4 8h8M6 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                {activeCategory === "all" ? "Все категории" : activeCategory}
              </span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={`transition-transform ${mobileMenuOpen ? "rotate-180" : ""}`}>
                <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            {mobileMenuOpen && (
              <div className="mt-2 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden max-h-72 overflow-y-auto">
                <button onClick={() => selectCategory("all")} className={`w-full text-left px-4 py-2.5 text-[13px] font-semibold border-b border-gray-100 ${activeCategory === "all" ? "text-brand-primary bg-brand-primary/5" : "text-gray-700 hover:bg-gray-50"}`}>
                  Все категории
                </button>
                {CATEGORY_LIST.map((cat) => (
                  <Link
                    key={cat.name}
                    href={getCategoryPath(cat.name)}
                    onClick={(event) => {
                      event.preventDefault();
                      selectCategory(cat.name);
                    }}
                    className={`w-full flex items-center gap-2.5 text-left px-4 py-2.5 text-[13px] border-b border-gray-100 last:border-0 ${activeCategory === cat.name ? "text-brand-primary bg-brand-primary/5 font-semibold" : "text-gray-600 hover:bg-gray-50"}`}
                  >
                    <span className="text-gray-400"><CategoryIcon type={cat.icon} /></span>
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* ── Сетка товаров ── */}
          <div className="flex-1 min-w-0 flex flex-col gap-6">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <p className="text-[14px] text-gray-500">
                {activeCategory !== "all" && (
                  <span className="font-semibold text-gray-900">{activeCategory} · </span>
                )}
                {filteredProducts.length} позиций
              </p>
            </div>

            {filteredProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {visibleProducts.map((product: Product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {hasMore && (
                  <div className="flex justify-center pt-2">
                    <button
                      onClick={() => setVisibleCount((n) => n + PAGE_SIZE)}
                      className="inline-flex items-center gap-2 px-7 py-3 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-[14px] font-semibold text-gray-700 rounded-full transition-all shadow-sm"
                    >
                      Показать ещё
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M7 3v8M3 9l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="py-20 text-center bg-gray-50 border border-gray-200 rounded-2xl">
                <p className="text-[15px] font-semibold text-gray-500 mb-3">В этой категории нет товаров</p>
                <button onClick={() => selectCategory("all")} className="text-brand-primary font-semibold text-[13px] hover:underline">
                  Показать все позиции
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* ── CTA полоса ── */}
      <div className="container mt-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-5 p-5 sm:p-7 lg:p-8 bg-gray-50 border border-gray-200 rounded-2xl">
          <div className="flex flex-col gap-1 text-center sm:text-left">
            <p className="text-[15px] sm:text-[16px] font-bold text-gray-900">Не нашли нужную позицию?</p>
            <p className="text-[13px] text-gray-500">Оставьте заявку — менеджер подберёт размер и марку за 30 минут.</p>
          </div>
          <div className="flex flex-col xs:flex-row gap-2.5 sm:gap-3 w-full sm:w-auto shrink-0">
            <button onClick={openModal} className="inline-flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-primary/90 text-white font-semibold text-[13px] px-5 py-2.5 rounded-full shadow-sm transition-all">
              Оставить заявку
            </button>
            <Link href="/contacts" className="inline-flex items-center justify-center gap-2 bg-white text-gray-700 font-semibold text-[13px] px-5 py-2.5 rounded-full border border-gray-200 hover:bg-gray-50 transition-all">
              Контакты
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
