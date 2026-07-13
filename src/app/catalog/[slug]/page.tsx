import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/features/catalog/ProductCard";
import { CatalogCtaButton } from "@/components/features/catalog/CatalogCtaButton";
import { ProductGallery } from "@/components/features/catalog/ProductGallery";
import { CONTACTS } from "@/lib/constants";
import { getProducts } from "@/lib/db";
import { getProductImage } from "@/lib/productImages";
import { getCategoryPath, getPublicProductGroup } from "@/lib/catalogRoutes";
import { findCalculatorPresetForProduct } from "@/lib/metal-calculator/catalogPresets";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

const ChevronRight = () => (
  <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden>
    <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
    <path d="M2.5 7L5.5 10L11.5 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const products = getProducts();
  const product = products.find((p) => p.slug === slug);

  if (!product) notFound();

  const productGroup = getPublicProductGroup(product);
  const related = products
    .filter((p) => p.slug !== product.slug && getPublicProductGroup(p) === productGroup)
    .slice(0, 4);
  const imgSrc = getProductImage(product);
  const calcPreset = findCalculatorPresetForProduct(product);

  return (
    <div className="flex flex-col pb-24">

      {/* ── Breadcrumb ── */}
      <div className="border-b border-gray-100 bg-white">
        <div className="container py-4">
          <nav aria-label="Хлебные крошки" className="flex items-center gap-1.5 text-[12px] font-semibold text-gray-400 flex-wrap">
            <Link href="/" className="hover:text-gray-700 transition-colors">Главная</Link>
            <ChevronRight />
            <Link href="/catalog" className="hover:text-gray-700 transition-colors">Каталог</Link>
            <ChevronRight />
            <Link href={getCategoryPath(productGroup)} className="hover:text-gray-700 transition-colors">
              {productGroup}
            </Link>
            <ChevronRight />
            <span className="text-gray-700 line-clamp-1">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* ── Основной блок ── */}
      <div className="container pt-8 sm:pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16">

          {/* ─ Левая колонка: фото ─ */}
          <ProductGallery
            src={imgSrc}
            alt={`${product.name} — металлопрокат в Бишкеке`}
            isNew={product.isNew}
          />

          {/* ─ Правая колонка: информация ─ */}
          <div className="flex flex-col gap-6">

            {/* Категория + бейдж */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-bold uppercase tracking-widest text-brand-primary">
                {productGroup}
              </span>
              {product.tags?.map((t) => (
                <span key={t} className="text-[11px] font-semibold text-gray-400 before:content-['·'] before:mr-2">{t}</span>
              ))}
            </div>

            {/* Название */}
            <h1 className="text-[22px] sm:text-[26px] md:text-[32px] font-bold text-gray-900 tracking-tight leading-snug break-words">
              {product.name}
            </h1>

            {/* Описание */}
            {product.desc && (
              <p className="text-[14px] sm:text-[15px] text-gray-500 leading-relaxed">{product.desc}</p>
            )}

            {/* Цена по запросу */}
            <div className="flex items-center gap-3 py-4 border-y border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-brand-primary flex items-center justify-center shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 5.49 5.49l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
              </div>
              <div>
                <p className="text-[15px] font-bold text-gray-900">Цена по запросу</p>
                <p className="text-[13px] text-gray-500">Менеджер рассчитает КП за 30 минут</p>
              </div>
            </div>

            {/* Фичи */}
            {product.features && product.features.length > 0 && (
              <div className="flex flex-col gap-2.5">
                {product.features.map((f) => (
                  <div key={f} className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                      <CheckIcon />
                    </div>
                    <span className="text-[14px] font-medium text-gray-700">{f}</span>
                  </div>
                ))}
              </div>
            )}

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <CatalogCtaButton
                productLabel={product.name}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-primary/90 active:scale-[0.98] text-white font-semibold text-[14px] px-6 py-3.5 rounded-xl shadow-sm transition-all"
              >
                Оставить заявку
              </CatalogCtaButton>
              <a
                href={`https://${CONTACTS.whatsapp}?text=${encodeURIComponent(`Здравствуйте! Интересует: ${product.name}. Подскажите цену и наличие.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#22c55e] text-white font-semibold text-[14px] px-6 py-3.5 rounded-xl transition-all"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                WhatsApp
              </a>
            </div>

            {/* Расчёт веса в калькуляторе */}
            {calcPreset && (
              <Link
                href={`/calculator?item=${product.slug}`}
                className="inline-flex items-center gap-2 text-[13px] font-semibold text-brand-primary hover:underline"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 6h8M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01"/>
                </svg>
                Рассчитать вес этой позиции в калькуляторе
              </Link>
            )}

            {/* Доставка */}
            <div className="flex flex-col gap-2 pt-2">
              <div className="flex items-center gap-2.5 text-[13px] text-gray-500">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M1 3h15v13H1z"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                Оперативная доставка по всему Кыргызстану
              </div>
              <div className="flex items-center gap-2.5 text-[13px] text-gray-500">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                Сертификаты ГОСТ и паспорт качества в комплекте
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── Характеристики ── */}
      {product.specs && product.specs.length > 0 && (
        <div className="container mt-12">
          <details open className="group border border-gray-200 rounded-xl overflow-hidden">
            <summary className="flex items-center justify-between px-6 sm:px-8 py-5 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer list-none [&::-webkit-details-marker]:hidden">
              <span className="text-[16px] font-bold text-gray-900">Технические характеристики</span>
              <svg
                width="20" height="20" viewBox="0 0 20 20" fill="none"
                className="transition-transform duration-200 group-open:rotate-180"
                aria-hidden
              >
                <path d="M5 8l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </summary>
            <div className="px-5 sm:px-8 py-2 divide-y divide-gray-100">
              {product.specs.map((spec) => (
                <div key={spec.label} className="flex items-start justify-between py-3.5 gap-3 sm:gap-4">
                  <span className="text-[13px] sm:text-[14px] text-gray-500 font-medium shrink-0">{spec.label}</span>
                  <span className="text-[13px] sm:text-[14px] font-semibold text-gray-900 text-right break-words min-w-0">{spec.value}</span>
                </div>
              ))}
            </div>
          </details>
        </div>
      )}

      {/* ── Похожие товары ── */}
      {related.length > 0 && (
        <div className="container mt-14">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[20px] font-bold text-gray-900">Похожие позиции</h2>
            <Link href="/catalog" className="text-[13px] font-semibold text-gray-500 hover:text-gray-900 transition-colors">
              Весь каталог →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
