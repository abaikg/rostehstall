"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import type { Order } from "@/lib/db";

interface Stats { products: number; blog: number; orders: number; newOrders: number }

const STATUS_LABEL: Record<string, string> = { new: "Новая", inwork: "В работе", done: "Выполнена", cancelled: "Отменена" };
const STATUS_COLOR: Record<string, string> = {
  new: "bg-red-100 text-red-700", inwork: "bg-yellow-100 text-yellow-700",
  done: "bg-green-100 text-green-700", cancelled: "bg-slate-100 text-slate-500",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("ru-RU", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

export default function AdminDashboard() {
  const [stats, setStats]         = useState<Stats>({ products: 0, blog: 0, orders: 0, newOrders: 0 });
  const [recent, setRecent]       = useState<Order[]>([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/products").then(r => r.json()),
      fetch("/api/admin/blog").then(r => r.json()),
      fetch("/api/admin/orders").then(r => r.json()),
    ]).then(([products, blog, orders]) => {
      setStats({ products: products.length, blog: blog.length, orders: orders.length, newOrders: orders.filter((o: Order) => o.status === "new").length });
      setRecent(orders.slice(0, 6));
      setLoading(false);
    });
  }, []);

  const statCards = [
    { label: "Новых заявок",   value: stats.newOrders, href: "/admin/orders",   color: "bg-red-50 border-red-200",    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="1.75" strokeLinecap="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>, textColor: "text-red-600" },
    { label: "Всего заявок",   value: stats.orders,    href: "/admin/orders",   color: "bg-blue-50 border-blue-200",  icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="1.75" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>, textColor: "text-blue-600" },
    { label: "Товаров",        value: stats.products,  href: "/admin/products", color: "bg-violet-50 border-violet-200", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="1.75" strokeLinecap="round"><path d="m7.5 4.27 9 5.15M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5M12 22V12"/></svg>, textColor: "text-violet-600" },
    { label: "Статей в блоге", value: stats.blog,      href: "/admin/blog",     color: "bg-emerald-50 border-emerald-200", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="1.75" strokeLinecap="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>, textColor: "text-emerald-600" },
  ];

  if (loading) return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[0,1,2,3].map(i => <div key={i} className="h-28 bg-white rounded-2xl border border-slate-200 animate-pulse" />)}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-6">

      {/* Приветствие */}
      <div>
        <h1 className="text-[26px] font-bold text-slate-900 tracking-tight">Добро пожаловать 👋</h1>
        <p className="text-[14px] text-slate-500 mt-0.5">
          {stats.newOrders > 0
            ? <span className="text-red-600 font-semibold">● {stats.newOrders} новых заявок — требуют внимания</span>
            : "Всё обработано, новых заявок нет"}
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((c) => (
          <Link key={c.label} href={c.href}
            className={`flex flex-col gap-3 p-5 rounded-2xl border ${c.color} hover:shadow-md transition-all group`}>
            <div className="flex items-center justify-between">
              {c.icon}
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-300 group-hover:text-slate-500 transition-colors" strokeLinecap="round"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
            </div>
            <div>
              <div className={`text-[32px] font-bold leading-none ${c.textColor}`}>{c.value}</div>
              <div className={`text-[12px] font-semibold mt-1 ${c.textColor}`}>{c.label}</div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Последние заявки */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-[15px] font-bold text-slate-900">Последние заявки</h2>
            <Link href="/admin/orders" className="text-[12px] font-semibold text-blue-600 hover:underline">Все заявки →</Link>
          </div>
          {recent.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-[14px]">Заявок пока нет</div>
          ) : (
            <div className="divide-y divide-slate-50">
              {recent.map((o) => (
                <Link key={o.id} href="/admin/orders"
                  className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50/70 transition-colors">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${o.status === "new" ? "bg-red-500" : o.status === "inwork" ? "bg-yellow-500" : o.status === "done" ? "bg-green-500" : "bg-slate-300"}`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-semibold text-slate-900 truncate">{o.name || "Без имени"}</div>
                    <div className="text-[12px] text-slate-400 truncate">{o.phone}{o.product ? ` · ${o.product}` : ""}</div>
                  </div>
                  <div className="shrink-0 flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${STATUS_COLOR[o.status]}`}>{STATUS_LABEL[o.status]}</span>
                    <span className="text-[11px] text-slate-400">{formatDate(o.createdAt)}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Быстрые действия */}
        <div className="flex flex-col gap-3">
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <h2 className="text-[14px] font-bold text-slate-900 mb-4">Быстрые действия</h2>
            <div className="flex flex-col gap-2">
              {[
                { href: "/admin/orders",      label: "Смотреть заявки",  color: "bg-red-50 text-red-700 border-red-200",    dot: stats.newOrders > 0 },
                { href: "/admin/products/new",label: "Добавить товар",   color: "bg-violet-50 text-violet-700 border-violet-200" },
                { href: "/admin/blog/new",     label: "Написать статью", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
                { href: "/catalog",            label: "Каталог сайта",   color: "bg-slate-50 text-slate-700 border-slate-200", target: "_blank" },
              ].map((a) => (
                <Link key={a.href} href={a.href} target={(a as { target?: string }).target}
                  className={`flex items-center justify-between px-4 py-2.5 rounded-xl border text-[13px] font-semibold ${a.color} hover:opacity-80 transition-opacity`}>
                  {a.label}
                  {a.dot && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
