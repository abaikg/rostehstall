"use client";
import React, { useState } from "react";
import Image from "next/image";

interface ProductGalleryProps {
  src: string;
  alt: string;
  isNew?: boolean;
}

/** Фото товара с фолбэком на плейсхолдер, если файл недоступен
 * (например, удалённая загрузка из админки). */
export const ProductGallery = ({ src, alt, isNew }: ProductGalleryProps) => {
  const [imgErr, setImgErr] = useState(false);

  return (
    <div className="relative bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl overflow-hidden aspect-[4/3]">
      {!imgErr ? (
        <Image
          src={src}
          alt={alt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
          onError={() => setImgErr(true)}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
          </svg>
        </div>
      )}
      {isNew && (
        <span className="absolute top-4 left-4 px-3 py-1.5 bg-green-500 text-white rounded-xl text-[11px] font-bold uppercase tracking-wider shadow-md">
          Новинка
        </span>
      )}
    </div>
  );
};
