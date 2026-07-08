"use client";
import React, { useState } from "react";
import Link from "next/link";
import { blogPosts, blogCategories, BlogPost } from "@/data/blog";
import { useOrderModal } from "@/context/ModalContext";

const ChevronRight = () => (
  <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden>
    <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
}

function PostCard({ post, featured = false }: { post: BlogPost; featured?: boolean }) {
  const [imgErr, setImgErr] = useState(false);
  const imgSrc = `https://source.unsplash.com/${featured ? "1200x630" : "800x450"}/?${encodeURIComponent(post.coverImgQuery)}`;

  if (featured) {
    return (
      <Link
        href={`/blog/${post.slug}`}
        className="group relative bg-white border border-gray-200 hover:border-gray-300 hover:shadow-xl rounded-xl overflow-hidden flex flex-col lg:flex-row transition-all duration-200"
      >
        {/* Фото */}
        <div className="relative bg-gradient-to-br from-slate-100 to-slate-200 lg:w-[55%] shrink-0 aspect-[16/9] lg:aspect-auto">
          {!imgErr ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imgSrc} alt={post.title} onError={() => setImgErr(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl">📰</div>
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10 pointer-events-none" />
        </div>

        {/* Контент */}
        <div className="flex flex-col justify-center gap-4 sm:gap-5 p-5 sm:p-8 lg:p-10 xl:p-12">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 bg-brand-primary/10 text-brand-primary text-[11px] font-bold rounded-xl uppercase tracking-widest">
              {post.category}
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider bg-yellow-50 border border-yellow-200 text-yellow-700 px-2.5 py-1 rounded-full">
              Рекомендуем
            </span>
          </div>
          <h2 className="text-[18px] sm:text-[22px] lg:text-[26px] font-bold text-gray-900 tracking-tight leading-snug group-hover:text-brand-primary transition-colors">
            {post.title}
          </h2>
          <p className="text-[13px] sm:text-[14px] text-gray-500 leading-relaxed line-clamp-3">{post.excerpt}</p>
          <div className="flex items-center gap-2 sm:gap-4 text-[11px] sm:text-[12px] text-gray-400 font-medium mt-auto flex-wrap">
            <span>{formatDate(post.date)}</span>
            <span className="hidden sm:inline">·</span>
            <span>{post.readTime} мин</span>
            <span className="hidden sm:inline">·</span>
            <span className="truncate">{post.author.name}</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group bg-white border border-gray-200 hover:border-gray-300 hover:shadow-lg rounded-xl overflow-hidden flex flex-col transition-all duration-200"
    >
      <div className="relative bg-gradient-to-br from-slate-100 to-slate-200 aspect-[16/9] overflow-hidden">
        {!imgErr ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imgSrc} alt={post.title} onError={() => setImgErr(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">📰</div>
        )}
      </div>
      <div className="flex flex-col gap-3 p-5 flex-1">
        <span className="text-[11px] font-bold uppercase tracking-widest text-brand-primary">{post.category}</span>
        <h3 className="text-[15px] font-bold text-gray-900 leading-snug group-hover:text-brand-primary transition-colors line-clamp-2">
          {post.title}
        </h3>
        <p className="text-[13px] text-gray-500 leading-relaxed line-clamp-2">{post.excerpt}</p>
        <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between text-[12px] text-gray-400 font-medium">
          <span>{formatDate(post.date)}</span>
          <span>{post.readTime} мин чтения</span>
        </div>
      </div>
    </Link>
  );
}

export default function BlogPage() {
  const { openModal } = useOrderModal();
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered = activeCategory === "all"
    ? blogPosts
    : blogPosts.filter((p) => p.category === activeCategory);

  const [featured, ...rest] = filtered;

  return (
    <div className="flex flex-col pb-24">

      {/* ── Шапка ── */}
      <div className="pt-8 sm:pt-14 pb-12 sm:pb-16 border-b border-gray-100">
        <div className="container flex flex-col gap-5">
          <nav className="flex items-center gap-1.5 text-[12px] font-semibold text-gray-400">
            <Link href="/" className="hover:text-gray-700 transition-colors">Главная</Link>
            <ChevronRight />
            <span className="text-gray-700">Блог</span>
          </nav>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
            <div className="flex flex-col gap-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-brand-primary text-[11px] font-bold uppercase tracking-widest w-fit">
                Полезные материалы
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Фильтры ── */}
      <div className="border-b border-gray-100 bg-white/95 sticky top-[56px] sm:top-[68px] z-20 backdrop-blur-sm">
        <div className="container">
          <div className="flex items-center gap-2 py-3 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveCategory("all")}
              className={`shrink-0 px-4 py-2 rounded-xl text-[13px] font-semibold transition-all ${activeCategory === "all" ? "bg-brand-primary text-white shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            >
              Все статьи
            </button>
            {blogCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 px-4 py-2 rounded-xl text-[13px] font-semibold transition-all ${activeCategory === cat ? "bg-brand-primary text-white shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Контент ── */}
      <div className="py-12 sm:py-16">
        <div className="container flex flex-col gap-8">

          {filtered.length === 0 && (
            <div className="py-20 text-center text-gray-400">Статей не найдено</div>
          )}

          {/* Главная карточка */}
          {featured && <PostCard post={featured} featured />}

          {/* Сетка остальных */}
          {rest.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {rest.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}

        </div>
      </div>

      {/* ── CTA ── */}
      <div className="container">
        <div className="relative overflow-hidden bg-[#0d1117] rounded-xl sm:rounded-xl p-6 sm:p-10 lg:p-14 flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-8">
          <div className="pointer-events-none absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4" />
          <div className="flex flex-col gap-3 z-10 text-center sm:text-left">
            <h2 className="text-[20px] sm:text-[24px] lg:text-[28px] font-bold text-white tracking-tight">
              Нужна консультация по металлопрокату?
            </h2>
            <p className="text-[13px] sm:text-[14px] text-gray-400 max-w-md leading-relaxed">
              Наши менеджеры помогут подобрать нужную марку стали и рассчитают стоимость за 30 минут.
            </p>
          </div>
          <div className="z-10 w-full sm:w-auto shrink-0">
            <button
              onClick={openModal}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-primary/90 text-white font-semibold text-[14px] px-7 py-3.5 rounded-xl shadow-lg shadow-brand-primary/25 transition-all"
            >
              Оставить заявку
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
