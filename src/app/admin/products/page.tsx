"use client";
import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import type { Product } from "@/data/catalog";
import { useAdmin } from "../_components/AdminContext";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [category, setCategory] = useState("all");
  const { toast } = useAdmin();

  useEffect(() => {
    fetch("/api/admin/products").then(r => r.json())
      .then(d => { setProducts(d); setLoading(false); });
  }, []);

  const [subcategory, setSubcategory] = useState("all");

  const categories = useMemo(() => ["all", ...Array.from(new Set(products.map(p => p.category)))], [products]);
  const subcategories = useMemo(() => [
    "all",
    ...Array.from(new Set(products
      .filter(p => category === "all" || p.category === category)
      .map(p => p.subcategory || "")
      .filter(Boolean))),
  ], [products, category]);

  const filtered = useMemo(() => products.filter(p =>
    (category === "all" || p.category === category) &&
    (subcategory === "all" || p.subcategory === subcategory) &&
    (!search || p.name.toLowerCase().includes(search.toLowerCase()) || p.slug.includes(search.toLowerCase()))
  ), [products, search, category, subcategory]);

  async function del(id: number, name: string) {
    if (!confirm(`Удалить «${name}»?`)) return;
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    setProducts(p => p.filter(x => x.id !== id));
    toast("Товар удалён");
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[24px] font-bold text-slate-900 tracking-tight">Товары</h1>
          <p className="text-[13px] text-slate-500 mt-0.5">{products.length} позиций в каталоге</p>
        </div>
        <Link href="/admin/products/new"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[13px] px-4 py-2.5 rounded-xl transition-colors shadow-sm shadow-blue-600/30">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Добавить товар
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-xs">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Поиск по названию или slug..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-[13px] outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10" />
        </div>
        <select value={category} onChange={e => { setCategory(e.target.value); setSubcategory("all"); }}
          className="border border-slate-200 bg-white rounded-xl px-3 py-2 text-[13px] font-medium text-slate-700 outline-none focus:border-blue-400 cursor-pointer">
          {categories.map(c => <option key={c} value={c}>{c === "all" ? "Все категории" : c}</option>)}
        </select>
        <select value={subcategory} onChange={e => setSubcategory(e.target.value)}
          className="border border-slate-200 bg-white rounded-xl px-3 py-2 text-[13px] font-medium text-slate-700 outline-none focus:border-blue-400 cursor-pointer">
          {subcategories.map(c => <option key={c} value={c}>{c === "all" ? "Все подкатегории" : c}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="flex flex-col divide-y divide-slate-50">
            {[0,1,2,3].map(i => <div key={i} className="h-14 animate-pulse bg-slate-50/60 m-3 rounded-xl" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 flex flex-col items-center gap-3 text-slate-400">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"><path d="m7.5 4.27 9 5.15M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5M12 22V12"/></svg>
            <span className="text-[14px] font-medium">Товары не найдены</span>
          </div>
        ) : (
          <>
            <div className="hidden md:grid grid-cols-[40px_1fr_170px_170px_120px] gap-0 text-[11px] font-bold text-slate-400 uppercase tracking-wider px-5 py-3 border-b border-slate-100 bg-slate-50">
              <span>#</span><span>Название</span><span>Категория</span><span>Подкатегория</span><span className="text-right">Действия</span>
            </div>
            <div className="divide-y divide-slate-50">
              {filtered.map(p => (
                <div key={p.id} className="grid grid-cols-[40px_1fr_100px] md:grid-cols-[40px_1fr_170px_170px_120px] gap-0 items-center px-5 py-3.5 hover:bg-slate-50/60 transition-colors group">
                  <span className="text-[12px] text-slate-400 font-mono">{p.id}</span>
                  <div className="min-w-0 flex items-center gap-2">
                    {p.isNew && <span className="shrink-0 px-1.5 py-0.5 bg-blue-100 text-blue-600 text-[9px] font-black rounded uppercase tracking-wider">New</span>}
                    <span className="text-[13px] font-semibold text-slate-800 truncate">{p.name}</span>
                  </div>
                  <span className="hidden md:block text-[12px] text-slate-500 truncate pr-4">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-[11px] font-medium">{p.category}</span>
                  </span>
                  <span className="hidden md:block text-[12px] text-slate-500 truncate pr-4">{p.subcategory || "—"}</span>
                  <div className="flex items-center justify-end gap-1.5">
                    <Link href={`/catalog/${p.slug}`} target="_blank"
                      className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors" title="Просмотр">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                    </Link>
                    <Link href={`/admin/products/${p.id}`}
                      className="p-1.5 rounded-xl text-blue-500 hover:text-blue-700 hover:bg-blue-50 transition-colors" title="Изменить">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </Link>
                    <button onClick={() => del(p.id, p.name)}
                      className="p-1.5 rounded-xl text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors" title="Удалить">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      {filtered.length > 0 && <p className="text-[12px] text-slate-400">Показано {filtered.length} из {products.length}</p>}
    </div>
  );
}
