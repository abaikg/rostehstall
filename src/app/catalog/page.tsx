"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Product } from "@/data/catalog";
import { useOrderModal } from "@/context/ModalContext";
import { getCategoryPath, getPublicProductGroup } from "@/lib/catalogRoutes";

type ProductGroup = {
  name: string;
  count: number;
  sample?: Product;
};

const SectionIcon = () => (
  <svg className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="3" y="5" width="14" height="10" rx="1.5" />
    <path d="M6 8h8M6 12h5" />
  </svg>
);

export default function CatalogPage() {
  const { openModal } = useOrderModal();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/products")
      .then((res) => (res.ok ? res.json() : []))
      .then((items: Product[]) => {
        if (!cancelled) setProducts(items);
      })
      .catch(() => {
        if (!cancelled) setProducts([]);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const groups = useMemo<ProductGroup[]>(() => {
    const map = new Map<string, ProductGroup>();

    for (const product of products) {
      const name = getPublicProductGroup(product);
      const current = map.get(name);

      map.set(name, {
        name,
        count: (current?.count ?? 0) + 1,
        sample: current?.sample ?? product,
      });
    }

    return Array.from(map.values());
  }, [products]);

  return (
    <div className="flex flex-col pb-24">
      <div className="border-b border-gray-100 pb-8 pt-8 sm:pt-12">
        <div className="container flex flex-col gap-4">
          <nav className="flex items-center gap-1.5 text-[12px] font-semibold text-gray-400">
            <Link href="/" className="transition-colors hover:text-gray-700">Главная</Link>
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden>
              <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-gray-700">Каталог</span>
          </nav>

          <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
            <div className="flex flex-col gap-2">
              <h1 className="text-[22px] font-bold tracking-tight text-gray-900 sm:text-[28px] md:text-[36px]">
                Каталог товаров
              </h1>
              <p className="max-w-2xl text-[14px] leading-relaxed text-gray-500">
                Разделы каталога собраны по подкатегориям. Откройте нужный раздел, чтобы посмотреть товары таблицей.
              </p>
            </div>
            <button
              onClick={openModal}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand-primary px-5 py-2.5 text-[13px] font-semibold text-white shadow-sm transition-all hover:bg-brand-primary/90 active:scale-[0.98] sm:w-auto"
            >
              Запросить прайс-лист
            </button>
          </div>
        </div>
      </div>

      <div className="container pb-4 pt-8">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-[14px] text-gray-500">
            <span className="font-semibold text-gray-900">{groups.length}</span> разделов ·{" "}
            <span className="font-semibold text-gray-900">{products.length}</span> позиций
          </p>
        </div>

        {groups.length > 0 ? (
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {groups.map((group) => (
              <Link
                key={group.name}
                href={getCategoryPath(group.name)}
                className="group flex min-h-[104px] flex-col justify-between rounded-lg border border-gray-200 bg-white p-3 transition-all hover:border-brand-primary hover:bg-blue-50 sm:min-h-28 sm:p-4"
              >
                <div className="flex items-start justify-between gap-2 sm:gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-brand-primary transition-colors group-hover:bg-white sm:h-9 sm:w-9">
                    <SectionIcon />
                  </span>
                  <span className="shrink-0 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-brand-primary transition-colors group-hover:bg-white sm:text-[11px]">
                    {group.count}
                  </span>
                </div>
                <div className="mt-3 flex flex-col gap-1 sm:mt-4">
                  <h2 className="line-clamp-2 text-[13px] font-bold uppercase leading-tight tracking-wide text-gray-900 sm:text-[15px]">{group.name}</h2>
                  {group.sample && (
                    <p className="line-clamp-1 text-[11px] text-gray-500 sm:text-[12px]">{group.sample.name}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-gray-200 bg-gray-50 py-20 text-center">
            <p className="mb-3 text-[15px] font-semibold text-gray-500">Товары загружаются</p>
          </div>
        )}
      </div>

      <div className="container mt-10">
        <div className="flex flex-col items-center justify-between gap-5 rounded-lg border border-gray-200 bg-gray-50 p-5 sm:flex-row sm:p-7 lg:p-8">
          <div className="flex flex-col gap-1 text-center sm:text-left">
            <p className="text-[15px] font-bold text-gray-900 sm:text-[16px]">Не нашли нужную позицию?</p>
            <p className="text-[13px] text-gray-500">Оставьте заявку, менеджер подберет размер и марку за 30 минут.</p>
          </div>
          <div className="flex w-full shrink-0 flex-col gap-2.5 sm:w-auto sm:flex-row sm:gap-3">
            <button onClick={openModal} className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-primary px-5 py-2.5 text-[13px] font-semibold text-white shadow-sm transition-all hover:bg-brand-primary/90">
              Оставить заявку
            </button>
            <Link href="/contacts" className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-[13px] font-semibold text-gray-700 transition-all hover:bg-gray-50">
              Контакты
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
