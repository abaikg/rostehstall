"use client";
import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import type { BlogPost } from "@/data/blog";
import { useAdmin } from "../_components/AdminContext";

export default function AdminBlogPage() {
  const [posts, setPosts]     = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");
  const { toast } = useAdmin();

  useEffect(() => {
    fetch("/api/admin/blog").then(r => r.json())
      .then(d => { setPosts(d); setLoading(false); });
  }, []);

  const filtered = useMemo(() => posts.filter(p =>
    !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase())
  ), [posts, search]);

  async function del(id: number, title: string) {
    if (!confirm(`Удалить «${title}»?`)) return;
    await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
    setPosts(p => p.filter(x => x.id !== id));
    toast("Статья удалена");
  }

  const categoryColors: Record<string, string> = {
    "Советы": "bg-blue-50 text-blue-600", "Обзор": "bg-violet-50 text-violet-600",
    "Технологии": "bg-emerald-50 text-emerald-600", "Новости": "bg-orange-50 text-orange-600",
    "Гайд": "bg-rose-50 text-rose-600",
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[24px] font-bold text-slate-900 tracking-tight">Блог</h1>
          <p className="text-[13px] text-slate-500 mt-0.5">{posts.length} статей опубликовано</p>
        </div>
        <Link href="/admin/blog/new"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[13px] px-4 py-2.5 rounded-xl transition-colors shadow-sm shadow-blue-600/30">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Новая статья
        </Link>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Поиск по заголовку..."
          className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-[13px] outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10" />
      </div>

      {/* Cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[0,1,2,3].map(i => <div key={i} className="h-36 bg-white rounded-2xl border border-slate-200 animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 py-16 flex flex-col items-center gap-3 text-slate-400">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
          <span className="text-[14px] font-medium">Статей не найдено</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map(p => (
            <div key={p.id} className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-3">
                <span className={`shrink-0 px-2.5 py-1 rounded-full text-[11px] font-bold ${categoryColors[p.category] ?? "bg-slate-100 text-slate-600"}`}>
                  {p.category}
                </span>
                <span className="text-[12px] text-slate-400 shrink-0">{new Date(p.date).toLocaleDateString("ru-RU", { day: "numeric", month: "short", year: "numeric" })}</span>
              </div>
              <div className="flex-1">
                <h3 className="text-[14px] font-bold text-slate-900 leading-snug line-clamp-2">{p.title}</h3>
                <p className="text-[12px] text-slate-500 mt-1 line-clamp-2">{p.excerpt}</p>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                <span className="text-[11px] text-slate-400">{p.author.name} · {p.readTime} мин</span>
                <div className="flex items-center gap-1.5">
                  <Link href={`/blog/${p.slug}`} target="_blank"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors" title="Просмотр">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                  </Link>
                  <Link href={`/admin/blog/${p.id}`}
                    className="p-1.5 rounded-lg text-blue-500 hover:text-blue-700 hover:bg-blue-50 transition-colors" title="Редактировать">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </Link>
                  <button onClick={() => del(p.id, p.title)}
                    className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors" title="Удалить">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
