"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Product, Spec } from "@/data/catalog";
import { buildPresetForProduct } from "@/lib/metal-calculator/catalogPresets";
import { useAdmin } from "../../_components/AdminContext";

const inp = "w-full border border-slate-200 rounded-xl px-3 py-2 text-[13px] outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 bg-white transition-colors";
const lbl = "text-[11px] font-semibold text-slate-500 uppercase tracking-wide";

// Стандартные характеристики собираются из полей формы — вручную
// редактируются только дополнительные
const STANDARD_SPEC_LABELS = new Set([
  "Подкатегория", "ГОСТ", "Марка стали", "Размер", "Толщина",
  "Вес 1м, кг", "Вес 1м2, кг", "Вес изделия, кг",
]);

function toSlug(s: string) {
  return s
    .toLowerCase()
    .replace(/[а-яё]/g, (c) => ({"а":"a","б":"b","в":"v","г":"g","д":"d","е":"e","ё":"yo","ж":"zh","з":"z","и":"i","й":"j","к":"k","л":"l","м":"m","н":"n","о":"o","п":"p","р":"r","с":"s","т":"t","у":"u","ф":"f","х":"h","ц":"ts","ч":"ch","ш":"sh","щ":"sch","ъ":"","ы":"y","ь":"","э":"e","ю":"yu","я":"ya"}[c] || c))
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildStandardSpecs(form: Partial<Product>): Spec[] {
  const rows: Array<[string, string | undefined]> = [
    ["Подкатегория", form.subcategory],
    ["ГОСТ", form.gost],
    ["Марка стали", form.steelGrade],
    ["Размер", form.size],
    ["Толщина", form.thickness],
    ["Вес 1м, кг", form.weightMeter],
    ["Вес 1м2, кг", form.weightSquareMeter],
    ["Вес изделия, кг", form.weightItem],
  ];
  return rows
    .filter(([, value]) => value && String(value).trim())
    .map(([label, value]) => ({ label, value: String(value).trim() }));
}

interface CategoryNode { name: string; icon: string; productCount: number; subcategories: { name: string; count: number }[] }

interface ProductFormProps {
  /** Товар для редактирования; undefined — создание нового */
  initial?: Product;
  title: string;
}

const NEW_SUB = "__new__";

export function ProductForm({ initial, title }: ProductFormProps) {
  const router = useRouter();
  const { toast } = useAdmin();
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<CategoryNode[]>([]);
  const [form, setForm] = useState<Partial<Product>>(
    initial ?? {
      name: "", category: "", subcategory: "", slug: "", imgQuery: "",
      image: "", desc: "", gost: "", steelGrade: "", size: "", thickness: "",
      weightMeter: "", weightSquareMeter: "", weightItem: "",
      isNew: false, price: "", priceUnit: "",
      specs: [], features: [],
    }
  );
  // Дополнительные (нестандартные) характеристики
  const [customSpecs, setCustomSpecs] = useState<Spec[]>(
    (initial?.specs ?? []).filter((s) => !STANDARD_SPEC_LABELS.has(s.label))
  );
  const [newSubMode, setNewSubMode] = useState(false);
  const [slugTouched, setSlugTouched] = useState(Boolean(initial));
  const [specInput, setSpecInput] = useState({ label: "", value: "" });
  const [featureInput, setFeatureInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((r) => r.json())
      .then((d) => {
        setCategories(d.categories);
        // Для нового товара подставляем первую категорию
        if (!initial && d.categories.length > 0) {
          setForm((f) => (f.category ? f : { ...f, category: d.categories[0].name }));
        }
      })
      .catch(() => toast("Не удалось загрузить категории", "error"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function set(key: keyof Product, value: unknown) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  const currentCategory = categories.find((c) => c.name === form.category);
  const subOptions = (currentCategory?.subcategories ?? [])
    .map((s) => s.name)
    .filter((n) => n !== "(без подкатегории)");

  // Живой статус: попадёт ли позиция в калькулятор
  const calcPreset = useMemo(() => {
    if (!form.name || !form.subcategory) return null;
    try {
      return buildPresetForProduct({ id: 0, imgQuery: "", ...form, slug: form.slug || "preview", name: form.name } as Product);
    } catch {
      return null;
    }
  }, [form]);

  const standardSpecs = buildStandardSpecs(form);

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

  function autoDesc() {
    const parts = [form.name, form.gost, form.steelGrade ? `Марка: ${form.steelGrade}` : ""].filter(Boolean);
    set("desc", parts.join(". ") + ".");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.category) { toast("Выберите категорию", "error"); return; }
    if (!form.subcategory?.trim()) { toast("Укажите подкатегорию — она определяет раздел каталога", "error"); return; }

    const subcategory = form.subcategory.trim();
    const payload: Partial<Product> = {
      ...form,
      subcategory,
      slug: form.slug?.trim() || toSlug(form.name || ""),
      tags: [subcategory],
      desc: form.desc?.trim() || [form.name, form.gost, form.steelGrade ? `Марка: ${form.steelGrade}` : ""].filter(Boolean).join(". ") + ".",
      specs: [...buildStandardSpecs({ ...form, subcategory }), ...customSpecs],
    };

    setSaving(true);
    const res = initial
      ? await fetch(`/api/admin/products/${initial.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
      : await fetch("/api/admin/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    setSaving(false);

    if (res.ok) {
      toast(initial ? "Товар сохранён" : "Товар создан");
      router.push("/admin/products");
    } else {
      const data = await res.json().catch(() => ({}));
      toast(data.error || "Ошибка сохранения", "error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => router.back()}
            className="flex items-center gap-1.5 text-slate-400 hover:text-slate-700 text-[13px] font-medium transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m15 18-6-6 6-6"/></svg>
            Назад
          </button>
          <span className="text-slate-300">/</span>
          <h1 className="text-[18px] font-bold text-slate-900">{title}</h1>
          {form.isNew && <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-[10px] font-black rounded uppercase tracking-wider">New</span>}
        </div>
        <button type="submit" disabled={saving}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-[13px] px-4 py-2 rounded-xl transition-colors shadow-sm shadow-blue-600/25">
          {saving
            ? <><svg className="animate-spin" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>Сохранение...</>
            : <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>{initial ? "Сохранить" : "Создать товар"}</>
          }
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4">
        {/* ── Левая колонка ── */}
        <div className="flex flex-col gap-3">
          {/* Изображение */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col gap-3">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Изображение</p>
            <div
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) uploadFile(f); }}
              className={`relative cursor-pointer rounded-xl border-2 border-dashed transition-all overflow-hidden ${dragOver ? "border-blue-400 bg-blue-50" : "border-slate-200 hover:border-blue-300 hover:bg-slate-50"}`}
              style={{ minHeight: 160 }}
            >
              {form.image ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={form.image} alt="preview" className="w-full h-full object-cover" style={{ minHeight: 160, maxHeight: 200 }} />
                  <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-[12px] font-semibold bg-black/50 px-3 py-1.5 rounded-xl">Заменить фото</span>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center gap-2 p-6 text-center" style={{ minHeight: 160 }}>
                  {uploading
                    ? <svg className="animate-spin text-blue-500" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                    : <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>}
                  <p className="text-[12px] text-slate-400 font-medium">{uploading ? "Загрузка..." : "Перетащите или кликните"}</p>
                  <p className="text-[11px] text-slate-300">JPG, PNG, WebP · до 5 МБ</p>
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden"
              onChange={(e) => e.target.files?.[0] && uploadFile(e.target.files[0])} />
            {form.image && (
              <button type="button" onClick={() => set("image", "")}
                className="flex items-center justify-center gap-1.5 text-[12px] text-red-400 hover:text-red-600 font-medium py-1.5 rounded-xl hover:bg-red-50 transition-colors">
                Удалить фото
              </button>
            )}
          </div>

          {/* Статус калькулятора */}
          <div className={`rounded-xl border p-4 flex flex-col gap-1.5 ${calcPreset ? "bg-green-50 border-green-200" : "bg-slate-50 border-slate-200"}`}>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Калькулятор веса</p>
            {calcPreset ? (
              <>
                <p className="text-[12px] font-semibold text-green-700">✓ Позиция попадёт в калькулятор</p>
                {calcPreset.weightDisplay && <p className="text-[12px] text-green-600">Справочный вес: {calcPreset.weightDisplay}</p>}
              </>
            ) : (
              <p className="text-[12px] text-slate-500 leading-relaxed">
                Не попадает в калькулятор: подкатегория не поддерживается или не заполнены размер/толщина.
              </p>
            )}
          </div>

          {/* Цена */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col gap-3">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Параметры</p>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1">
                <label className={lbl}>Цена</label>
                <input value={form.price || ""} onChange={(e) => set("price", e.target.value)} className={inp} placeholder="68 500" />
              </div>
              <div className="flex flex-col gap-1">
                <label className={lbl}>Ед. цены</label>
                <input value={form.priceUnit || ""} onChange={(e) => set("priceUnit", e.target.value)} className={inp} placeholder="сом/т" />
              </div>
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

        {/* ── Правая колонка ── */}
        <div className="flex flex-col gap-3">
          {/* Основное */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col gap-3">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Основная информация</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1 sm:col-span-2">
                <label className={lbl}>Название <span className="text-red-400">*</span></label>
                <input required value={form.name || ""}
                  onChange={(e) => {
                    set("name", e.target.value);
                    if (!slugTouched) set("slug", toSlug(e.target.value));
                  }}
                  className={inp} placeholder="Труба профильная 40×40×2" />
              </div>

              <div className="flex flex-col gap-1">
                <label className={lbl}>Категория <span className="text-red-400">*</span></label>
                <select value={form.category || ""} onChange={(e) => { set("category", e.target.value); set("subcategory", ""); setNewSubMode(false); }} className={inp}>
                  {categories.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className={lbl}>Подкатегория <span className="text-red-400">*</span></label>
                {newSubMode ? (
                  <div className="flex gap-1.5">
                    <input autoFocus value={form.subcategory || ""} onChange={(e) => set("subcategory", e.target.value)}
                      className={inp} placeholder="Новая подкатегория" />
                    <button type="button" onClick={() => { setNewSubMode(false); set("subcategory", subOptions[0] ?? ""); }}
                      className="shrink-0 px-2.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors" title="Выбрать из существующих">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                  </div>
                ) : (
                  <select
                    value={form.subcategory || ""}
                    onChange={(e) => {
                      if (e.target.value === NEW_SUB) { setNewSubMode(true); set("subcategory", ""); }
                      else set("subcategory", e.target.value);
                    }}
                    className={inp}
                  >
                    {!form.subcategory && <option value="">— выберите —</option>}
                    {subOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                    {form.subcategory && !subOptions.includes(form.subcategory) && (
                      <option value={form.subcategory}>{form.subcategory}</option>
                    )}
                    <option value={NEW_SUB}>+ Новая подкатегория...</option>
                  </select>
                )}
              </div>

              <div className="flex flex-col gap-1 sm:col-span-2">
                <label className={lbl}>Slug (URL)</label>
                <input value={form.slug || ""} onChange={(e) => { setSlugTouched(true); set("slug", e.target.value); }}
                  className={`${inp} font-mono text-[12px]`} placeholder="генерируется из названия" />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <label className={lbl}>Описание</label>
                <button type="button" onClick={autoDesc} className="text-[11px] font-semibold text-blue-500 hover:text-blue-700 transition-colors">
                  Сгенерировать из полей
                </button>
              </div>
              <textarea rows={3} value={form.desc || ""} onChange={(e) => set("desc", e.target.value)}
                className={`${inp} resize-none leading-relaxed`}
                placeholder="Оставьте пустым — соберётся из названия, ГОСТ и марки" />
            </div>
          </div>

          {/* Технические поля */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Технические данные</p>
              <span className="text-[11px] text-slate-400">формируют характеристики и калькулятор</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="flex flex-col gap-1">
                <label className={lbl}>ГОСТ</label>
                <input value={form.gost || ""} onChange={(e) => set("gost", e.target.value)} className={inp} placeholder="ГОСТ 8732-78" />
              </div>
              <div className="flex flex-col gap-1">
                <label className={lbl}>Марка стали</label>
                <input value={form.steelGrade || ""} onChange={(e) => set("steelGrade", e.target.value)} className={inp} placeholder="Ст3сп/09Г2С" />
              </div>
              <div className="flex flex-col gap-1">
                <label className={lbl}>Размер</label>
                <input value={form.size || ""} onChange={(e) => set("size", e.target.value)} className={inp} placeholder="40x40 / ⌀16 / 1500x6000" />
              </div>
              <div className="flex flex-col gap-1">
                <label className={lbl}>Толщина, мм</label>
                <input value={form.thickness || ""} onChange={(e) => set("thickness", e.target.value)} className={inp} placeholder="2" />
              </div>
              <div className="flex flex-col gap-1">
                <label className={lbl}>Вес 1 м, кг</label>
                <input value={form.weightMeter || ""} onChange={(e) => set("weightMeter", e.target.value)} className={inp} placeholder="2.33" />
              </div>
              <div className="flex flex-col gap-1">
                <label className={lbl}>Вес 1 м², кг</label>
                <input value={form.weightSquareMeter || ""} onChange={(e) => set("weightSquareMeter", e.target.value)} className={inp} placeholder="15.7" />
              </div>
              <div className="flex flex-col gap-1">
                <label className={lbl}>Вес изделия, кг</label>
                <input value={form.weightItem || ""} onChange={(e) => set("weightItem", e.target.value)} className={inp} placeholder="0.12" />
              </div>
            </div>
          </div>

          {/* Характеристики */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Характеристики</p>
              <span className="text-[11px] text-slate-400">{standardSpecs.length} авто + {customSpecs.length} доп.</span>
            </div>

            {standardSpecs.length > 0 && (
              <div className="flex flex-col gap-1">
                {standardSpecs.map((s) => (
                  <div key={s.label} className="grid grid-cols-[1fr_1fr] gap-2 items-center">
                    <div className="px-3 py-1.5 bg-slate-50 rounded-xl text-[12px] font-semibold text-slate-500 truncate">{s.label}</div>
                    <div className="px-3 py-1.5 bg-slate-50 rounded-xl text-[12px] text-slate-500 truncate">{s.value}</div>
                  </div>
                ))}
                <p className="text-[11px] text-slate-400 mt-0.5">Собираются автоматически из технических полей выше.</p>
              </div>
            )}

            {customSpecs.map((s, i) => (
              <div key={i} className="grid grid-cols-[1fr_1fr_28px] gap-2 items-center group">
                <div className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-[12px] font-semibold text-slate-700 truncate">{s.label}</div>
                <div className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-[12px] text-slate-500 truncate">{s.value}</div>
                <button type="button" onClick={() => setCustomSpecs((cs) => cs.filter((_, idx) => idx !== i))}
                  className="w-7 h-7 flex items-center justify-center rounded-xl text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
            ))}

            <div className="grid grid-cols-[1fr_1fr_auto] gap-2">
              <input value={specInput.label} onChange={(e) => setSpecInput((s) => ({ ...s, label: e.target.value }))}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); if (specInput.label) { setCustomSpecs((cs) => [...cs, specInput]); setSpecInput({ label: "", value: "" }); } } }}
                className={`${inp} text-[12px]`} placeholder="Доп. характеристика" />
              <input value={specInput.value} onChange={(e) => setSpecInput((s) => ({ ...s, value: e.target.value }))}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); if (specInput.label) { setCustomSpecs((cs) => [...cs, specInput]); setSpecInput({ label: "", value: "" }); } } }}
                className={`${inp} text-[12px]`} placeholder="Значение" />
              <button type="button" onClick={() => { if (specInput.label) { setCustomSpecs((cs) => [...cs, specInput]); setSpecInput({ label: "", value: "" }); } }}
                className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold rounded-xl transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              </button>
            </div>
          </div>

          {/* Преимущества */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Преимущества</p>
              <span className="text-[11px] text-slate-400">{(form.features || []).length} позиций</span>
            </div>
            {(form.features || []).map((f: string, i: number) => (
              <div key={i} className="flex items-center gap-2 group">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                <span className="flex-1 text-[13px] text-slate-700 py-1">{f}</span>
                <button type="button" onClick={() => set("features", (form.features || []).filter((_, idx) => idx !== i))}
                  className="w-7 h-7 flex items-center justify-center rounded-xl text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
            ))}
            <div className="flex gap-2">
              <input value={featureInput} onChange={(e) => setFeatureInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); if (featureInput.trim()) { set("features", [...(form.features || []), featureInput.trim()]); setFeatureInput(""); } } }}
                className={`${inp} flex-1 text-[12px]`} placeholder="Точные геометрические параметры" />
              <button type="button" onClick={() => { if (featureInput.trim()) { set("features", [...(form.features || []), featureInput.trim()]); setFeatureInput(""); } }}
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
        {saving ? "Сохранение..." : initial ? "Сохранить" : "Создать товар"}
      </button>
    </form>
  );
}
