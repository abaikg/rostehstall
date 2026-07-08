"use client";
import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CATEGORY_LIST } from "@/data/catalog";
import type { Product, Spec } from "@/data/catalog";
import { useAdmin } from "../../_components/AdminContext";

function toSlug(s: string) {
  return s
    .toLowerCase()
    .replace(/[а-яё]/g, (c) => ({"а":"a","б":"b","в":"v","г":"g","д":"d","е":"e","ё":"yo","ж":"zh","з":"z","и":"i","й":"j","к":"k","л":"l","м":"m","н":"n","о":"o","п":"p","р":"r","с":"s","т":"t","у":"u","ф":"f","х":"h","ц":"ts","ч":"ch","ш":"sh","щ":"sch","ъ":"","ы":"y","ь":"","э":"e","ю":"yu","я":"ya"}[c] || c))
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function NewProductPage() {
  const router = useRouter();
  const { toast } = useAdmin();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Partial<Product>>({
    name: "", category: CATEGORY_LIST[0].name, slug: "", imgQuery: "",
    image: "", desc: "", isNew: false, price: "", priceUnit: "сом/т",
    specs: [], features: [],
  });
  const [specInput, setSpecInput] = useState({ label: "", value: "" });
  const [featureInput, setFeatureInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function set(key: keyof Product, value: unknown) {
    setForm(f => ({ ...f, [key]: value }));
  }

  async function uploadFile(file: File) {
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const data = await res.json();
    setUploading(false);
    if (data.url) { set("image", data.url); toast("Изображение загружено"); }
    else toast(data.error || "Ошибка загрузки", "error");
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault(); setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadFile(file);
  }

  function addSpec() {
    if (!specInput.label) return;
    set("specs", [...(form.specs || []), specInput]);
    setSpecInput({ label: "", value: "" });
  }

  function removeSpec(i: number) {
    set("specs", (form.specs || []).filter((_, idx) => idx !== i));
  }

  function addFeature() {
    if (!featureInput.trim()) return;
    set("features", [...(form.features || []), featureInput.trim()]);
    setFeatureInput("");
  }

  function removeFeature(i: number) {
    set("features", (form.features || []).filter((_, idx) => idx !== i));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/admin/products", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) { toast("Товар создан"); router.push("/admin/products"); }
    else toast("Ошибка при создании товара", "error");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => router.back()}
            className="flex items-center gap-1.5 text-slate-400 hover:text-slate-700 text-[13px] font-medium transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m15 18-6-6 6-6"/></svg>
            Назад
          </button>
          <span className="text-slate-300">/</span>
          <h1 className="text-[18px] font-bold text-slate-900">Новый товар</h1>
        </div>
        <button type="submit" disabled={saving}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-[13px] px-4 py-2 rounded-xl transition-colors shadow-sm shadow-blue-600/25">
          {saving
            ? <><svg className="animate-spin" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>Создание...</>
            : <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>Создать товар</>
          }
        </button>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4">
        {/* Left: Image */}
        <div className="flex flex-col gap-3">
          <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col gap-3">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Изображение</p>

            <div
              onClick={() => fileRef.current?.click()}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`relative cursor-pointer rounded-xl border-2 border-dashed transition-all overflow-hidden
                ${dragOver ? "border-blue-400 bg-blue-50" : "border-slate-200 hover:border-blue-300 hover:bg-slate-50"}`}
              style={{ minHeight: 180 }}
            >
              {form.image ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={form.image} alt="preview" className="w-full h-full object-cover" style={{ minHeight: 180, maxHeight: 220 }} />
                  <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-[12px] font-semibold bg-black/50 px-3 py-1.5 rounded-xl">Заменить фото</span>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center gap-2 p-6 text-center" style={{ minHeight: 180 }}>
                  {uploading ? (
                    <svg className="animate-spin text-blue-500" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                  ) : (
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                  )}
                  <p className="text-[12px] text-slate-400 font-medium">{uploading ? "Загрузка..." : "Перетащите или кликните"}</p>
                  <p className="text-[11px] text-slate-300">JPG, PNG, WebP · до 5 МБ</p>
                </div>
              )}
            </div>

            <input ref={fileRef} type="file" accept="image/*" className="hidden"
              onChange={e => e.target.files?.[0] && uploadFile(e.target.files[0])} />

            {form.image && (
              <button type="button" onClick={() => set("image", "")}
                className="flex items-center justify-center gap-1.5 text-[12px] text-red-400 hover:text-red-600 font-medium py-1.5 rounded-xl hover:bg-red-50 transition-colors">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
                Удалить фото
              </button>
            )}

            <div className="flex flex-col gap-1">
              <label className={lbl}>Ключевые слова (imgQuery)</label>
              <input value={form.imgQuery || ""} onChange={e => set("imgQuery", e.target.value)}
                className={inp} placeholder="steel pipe metal industrial" />
            </div>
          </div>

          {/* Meta */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col gap-3">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Параметры</p>
            <div className="flex flex-col gap-1">
              <label className={lbl}>Цена</label>
              <input value={form.price || ""} onChange={e => set("price", e.target.value)} className={inp} placeholder="68 500" />
            </div>
            <div className="flex flex-col gap-1">
              <label className={lbl}>Единица цены</label>
              <input value={form.priceUnit || ""} onChange={e => set("priceUnit", e.target.value)} className={inp} placeholder="сом/т" />
            </div>
            <label className="flex items-center gap-2.5 cursor-pointer group py-1">
              <div className={`w-9 h-5 rounded-full transition-colors relative ${form.isNew ? "bg-blue-600" : "bg-slate-200"}`}
                onClick={() => set("isNew", !form.isNew)}>
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${form.isNew ? "left-4" : "left-0.5"}`} />
              </div>
              <span className="text-[13px] font-medium text-slate-700 group-hover:text-slate-900">Новинка</span>
            </label>
          </div>
        </div>

        {/* Right: Main fields */}
        <div className="flex flex-col gap-3">
          {/* Basic info */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col gap-3">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Основная информация</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1 sm:col-span-2">
                <label className={lbl}>Название <span className="text-red-400">*</span></label>
                <input required value={form.name}
                  onChange={e => { set("name", e.target.value); set("slug", toSlug(e.target.value)); }}
                  className={inp} placeholder="Труба профильная 40×40×2 мм" />
              </div>
              <div className="flex flex-col gap-1">
                <label className={lbl}>Slug (URL) <span className="text-red-400">*</span></label>
                <input required value={form.slug} onChange={e => set("slug", e.target.value)}
                  className={`${inp} font-mono text-[12px]`} placeholder="truba-profilnaya" />
              </div>
              <div className="flex flex-col gap-1">
                <label className={lbl}>Категория</label>
                <select value={form.category} onChange={e => set("category", e.target.value)} className={inp}>
                  {CATEGORY_LIST.map(c => <option key={c.name}>{c.name}</option>)}
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className={lbl}>Описание</label>
              <textarea rows={4} value={form.desc || ""} onChange={e => set("desc", e.target.value)}
                className={`${inp} resize-none leading-relaxed`}
                placeholder="Краткое описание товара, применение, особенности..." />
            </div>
          </div>

          {/* Specs */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Характеристики</p>
              <span className="text-[11px] text-slate-400">{(form.specs || []).length} позиций</span>
            </div>

            {(form.specs || []).length > 0 && (
              <div className="flex flex-col gap-1.5">
                {(form.specs || []).map((s: Spec, i) => (
                  <div key={i} className="grid grid-cols-[1fr_1fr_28px] gap-2 items-center group">
                    <div className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-[12px] font-semibold text-slate-700 truncate">{s.label}</div>
                    <div className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-[12px] text-slate-500 truncate">{s.value}</div>
                    <button type="button" onClick={() => removeSpec(i)}
                      className="w-7 h-7 flex items-center justify-center rounded-xl text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-[1fr_1fr_auto] gap-2">
              <input value={specInput.label} onChange={e => setSpecInput(s => ({ ...s, label: e.target.value }))}
                onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addSpec())}
                className={`${inp} text-[12px]`} placeholder="Диаметр" />
              <input value={specInput.value} onChange={e => setSpecInput(s => ({ ...s, value: e.target.value }))}
                onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addSpec())}
                className={`${inp} text-[12px]`} placeholder="40 мм" />
              <button type="button" onClick={addSpec}
                className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold rounded-xl transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              </button>
            </div>
          </div>

          {/* Features */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Преимущества</p>
              <span className="text-[11px] text-slate-400">{(form.features || []).length} позиций</span>
            </div>

            {(form.features || []).length > 0 && (
              <div className="flex flex-col gap-1.5">
                {(form.features || []).map((f: string, i) => (
                  <div key={i} className="flex items-center gap-2 group">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                    <span className="flex-1 text-[13px] text-slate-700 py-1.5">{f}</span>
                    <button type="button" onClick={() => removeFeature(i)}
                      className="w-7 h-7 flex items-center justify-center rounded-xl text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <input value={featureInput} onChange={e => setFeatureInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addFeature())}
                className={`${inp} flex-1 text-[12px]`} placeholder="Точные геометрические параметры" />
              <button type="button" onClick={addFeature}
                className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold rounded-xl transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile save */}
      <button type="submit" disabled={saving}
        className="lg:hidden w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors text-[14px]">
        {saving ? "Создание..." : "Создать товар"}
      </button>
    </form>
  );
}

const inp = "w-full border border-slate-200 rounded-xl px-3 py-2 text-[13px] outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 bg-white transition-colors";
const lbl = "text-[11px] font-semibold text-slate-500 uppercase tracking-wide";
