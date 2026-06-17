"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Product } from "@/data/catalog";
import { getProductImage } from "@/lib/productImages";

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

  return (
    <Link
      href={`/catalog/${product.slug}`}
      className="group bg-white border border-gray-200 hover:border-gray-300 hover:shadow-lg rounded-2xl overflow-hidden flex flex-col transition-all duration-200"
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
          <span className="absolute top-2.5 left-2.5 px-2.5 py-1 bg-green-500 text-white rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">
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
            <span className="text-[11px] text-gray-400 font-medium">{product.category}</span>
            {product.tags?.slice(0, 1).map((t) => (
              <span key={t} className="text-[11px] text-gray-400 font-medium before:content-[','] before:mr-1">{t}</span>
            ))}
          </div>
        )}

        <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
          <span className="text-[12px] font-semibold text-brand-primary">Узнать цену →</span>
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
