"use client";
import React, { useState } from "react";
import Link from "next/link";
import type { Product } from "@/data/catalog";
import { getProductImage } from "@/lib/productImages";
import { getPublicProductGroup } from "@/lib/catalogRoutes";
import { CONTACTS } from "@/lib/constants";
import { trackLead } from "@/lib/analytics";

const WhatsAppIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
  </svg>
);

type ProductCardProps = {
  product: Product;
  hideSize?: boolean;
  hideMeta?: boolean;
};

const stripSizeFromName = (name: string) =>
  name
    .replace(/\s+\d+(?:[.,]\d+)?(?:\s*[xXхХ×]\s*\d+(?:[.,]\d+)?){1,3}\s*(?:мм|см|м)?/gi, "")
    .replace(/\s+\d+(?:[.,]\d+)?\s*(?:мм|см)(?=$|\s)/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim();

export const ProductCard = ({ product, hideSize = false, hideMeta = false }: ProductCardProps) => {
  const [imgErr, setImgErr] = useState(false);

  const imgSrc = getProductImage(product);
  const productName = hideSize ? stripSizeFromName(product.name) : product.name;
  const productGroup = getPublicProductGroup(product);

  // window.open обходит глобальный ConversionTracker — фиксируем цель сами
  const openWhatsApp = (e: React.SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
    trackLead("whatsapp");
    window.open(
      `https://${CONTACTS.whatsapp}?text=${encodeURIComponent(`Здравствуйте! Интересует: ${product.name}. Подскажите цену и наличие.`)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <Link
      href={`/catalog/${product.slug}`}
      className="group bg-white border border-gray-200 hover:border-gray-300 hover:shadow-lg rounded-xl overflow-hidden flex flex-col transition-all duration-200"
    >
      {/* Фото */}
      <div className="relative bg-gradient-to-br from-slate-100 to-slate-200 aspect-[4/3] overflow-hidden">
        {!imgErr ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imgSrc}
            alt={`${productName} — каталог металлопроката Ростехсталь`}
            onError={() => setImgErr(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
            </svg>
          </div>
        )}
        {product.isNew && (
          <span className="absolute top-2.5 left-2.5 px-2.5 py-1 bg-green-500 text-white rounded-xl text-[10px] font-bold uppercase tracking-wider shadow-sm">
            Новинка
          </span>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      </div>

      {/* Контент */}
      <div className="flex flex-col gap-2.5 p-4 flex-1">
        <p className="text-[13px] font-bold text-gray-900 leading-snug group-hover:text-brand-primary transition-colors line-clamp-2">
          {productName}
        </p>

        {!hideMeta && (
          <div className="flex flex-wrap gap-1 mt-0.5">
            <span className="text-[11px] text-gray-400 font-medium">{productGroup}</span>
          </div>
        )}

        <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
          {/* Вложенный <a> внутри Link недопустим — открываем WhatsApp обработчиком */}
          <span
            role="button"
            tabIndex={0}
            aria-label={`Написать в WhatsApp: ${productName}`}
            onClick={openWhatsApp}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") openWhatsApp(e);
            }}
            className="inline-flex items-center gap-1.5 rounded-xl bg-green-50 px-3 py-1.5 text-[12px] font-semibold text-green-700 transition-colors hover:bg-green-500 hover:text-white"
          >
            <WhatsAppIcon /> Написать WhatsApp
          </span>
          <div className="w-7 h-7 rounded-full bg-gray-100 group-hover:bg-brand-primary group-hover:text-white transition-all flex items-center justify-center text-gray-400 shrink-0">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 6h8M6.5 3l3 3-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
};
