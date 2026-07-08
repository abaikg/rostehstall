"use client";
import React, { useEffect, useState, useMemo } from "react";
import type { Order } from "@/lib/db";
import { useAdmin } from "../_components/AdminContext";

const STATUS: Record<Order["status"], { label: string; color: string; dot: string }> = {
  new:       { label: "Новая",     color: "bg-red-100 text-red-700 border-red-200",       dot: "bg-red-500" },
  inwork:    { label: "В работе",  color: "bg-yellow-100 text-yellow-700 border-yellow-200", dot: "bg-yellow-500" },
  done:      { label: "Выполнена", color: "bg-green-100 text-green-700 border-green-200",  dot: "bg-green-500" },
  cancelled: { label: "Отменена",  color: "bg-slate-100 text-slate-500 border-slate-200",  dot: "bg-slate-400" },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("ru-RU", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

export default function AdminOrdersPage() {
  const [orders, setOrders]   = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab]         = useState<Order["status"] | "all">("all");
  const [search, setSearch]   = useState("");
  const { toast, refreshOrders } = useAdmin();

  useEffect(() => {
    fetch("/api/admin/orders").then(r => r.json())
      .then(d => { setOrders(d); setLoading(false); });
  }, []);

  async function setStatus(id: string, status: Order["status"]) {
    await fetch(`/api/admin/orders/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    setOrders(p => p.map(o => o.id === id ? { ...o, status } : o));
    refreshOrders();
    toast(`Статус изменён: ${STATUS[status].label}`);
  }

  async function remove(id: string) {
    if (!confirm("Удалить заявку?")) return;
    await fetch(`/api/admin/orders/${id}`, { method: "DELETE" });
    setOrders(p => p.filter(o => o.id !== id));
    refreshOrders();
    toast("Заявка удалена");
  }

  const counts = useMemo(() => ({
    all: orders.length,
    new: orders.filter(o => o.status === "new").length,
    inwork: orders.filter(o => o.status === "inwork").length,
    done: orders.filter(o => o.status === "done").length,
    cancelled: orders.filter(o => o.status === "cancelled").length,
  }), [orders]);

  const filtered = useMemo(() => orders
    .filter(o => tab === "all" || o.status === tab)
    .filter(o => !search || o.name?.toLowerCase().includes(search.toLowerCase()) || o.phone?.includes(search) || o.email?.toLowerCase().includes(search.toLowerCase())),
  [orders, tab, search]);

  const tabs: { key: Order["status"] | "all"; label: string }[] = [
    { key: "all",       label: `Все (${counts.all})` },
    { key: "new",       label: `Новые` },
    { key: "inwork",    label: `В работе` },
    { key: "done",      label: `Выполнены` },
    { key: "cancelled", label: `Отменены` },
  ];

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[24px] font-bold text-slate-900 tracking-tight">Заявки</h1>
          <p className="text-[13px] text-slate-500 mt-0.5">
            {counts.new > 0
              ? <span className="text-red-600 font-semibold">● {counts.new} новых — требуют обработки</span>
              : "Все заявки обработаны"}
          </p>
        </div>
      </div>

      {/* Tabs + search */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl overflow-x-auto">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`relative shrink-0 px-3.5 py-1.5 rounded-xl text-[13px] font-semibold transition-all ${
                tab === t.key ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}>
              {t.label}
              {t.key === "new" && counts.new > 0 && (
                <span className="ml-1.5 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full inline-flex items-center justify-center">
                  {counts.new}
                </span>
              )}
            </button>
          ))}
        </div>
        <div className="relative flex-1 max-w-xs">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Поиск по имени, телефону, email..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-[13px] outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10" />
        </div>
      </div>

      {/* Cards */}
      {loading ? (
        <div className="flex flex-col gap-3">
          {[0,1,2].map(i => <div key={i} className="h-28 bg-white rounded-xl border border-slate-200 animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 py-16 flex flex-col items-center gap-3 text-slate-400">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          <span className="text-[14px] font-medium">Заявок не найдено</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
          {filtered.map(o => (
            <div key={o.id} className={`bg-white rounded-xl border overflow-hidden transition-shadow hover:shadow-md ${o.status === "new" ? "border-red-200" : "border-slate-200"}`}>
              <div className="flex flex-col sm:flex-row gap-4 p-5">
                {/* Left */}
                <div className="flex-1 flex flex-col gap-2">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${STATUS[o.status].color}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${STATUS[o.status].dot}`} />
                      {STATUS[o.status].label}
                    </span>
                    <span className="text-[12px] text-slate-400">{formatDate(o.createdAt)}</span>
                  </div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-[16px] font-bold text-slate-900">{o.name || <span className="text-slate-400 font-normal">Без имени</span>}</span>
                    {o.phone && <a href={`tel:${o.phone}`} className="text-[14px] font-semibold text-blue-600 hover:underline">{o.phone}</a>}
                  </div>
                  {o.email && <a href={`mailto:${o.email}`} className="text-[13px] font-semibold text-slate-500 hover:text-blue-600 hover:underline">{o.email}</a>}
                  {o.product && <div className="text-[13px] text-slate-500">📦 {o.product}</div>}
                  {o.comment && <div className="text-[13px] text-slate-600 bg-slate-50 rounded-xl px-3.5 py-2.5 mt-1 leading-relaxed">{o.comment}</div>}
                </div>

                {/* Right: actions */}
                <div className="flex sm:flex-col gap-2 shrink-0">
                  <select value={o.status} onChange={e => setStatus(o.id, e.target.value as Order["status"])}
                    className="flex-1 sm:flex-none border border-slate-200 rounded-xl px-3 py-2 text-[13px] font-semibold text-slate-700 outline-none focus:border-blue-400 cursor-pointer bg-white hover:border-blue-300 transition-colors">
                    <option value="new">Новая</option>
                    <option value="inwork">В работе</option>
                    <option value="done">Выполнена</option>
                    <option value="cancelled">Отменена</option>
                  </select>
                  {o.phone && (
                    <a href={`tel:${o.phone}`}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-green-50 text-green-700 border border-green-200 text-[13px] font-semibold rounded-xl hover:bg-green-100 transition-colors">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 5.49 5.49l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                      Позвонить
                    </a>
                  )}
                  <button onClick={() => remove(o.id)}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-500 border border-red-100 text-[13px] font-semibold rounded-xl hover:bg-red-100 transition-colors">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>
                    Удалить
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
