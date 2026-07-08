"use client";
import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { BlogPost } from "@/data/blog";
import { useAdmin } from "../../_components/AdminContext";

const CATEGORIES = ["Советы", "Обзор", "Технологии", "Новости", "Гайд"];

const CATEGORY_COLORS: Record<string, string> = {
  "Советы": "bg-blue-100 text-blue-700",
  "Обзор": "bg-violet-100 text-violet-700",
  "Технологии": "bg-emerald-100 text-emerald-700",
  "Новости": "bg-orange-100 text-orange-700",
  "Гайд": "bg-rose-100 text-rose-700",
};

function toSlug(s: string) {
  return s
    .toLowerCase()
    .replace(/[а-яё]/g, (c) => ({"а":"a","б":"b","в":"v","г":"g","д":"d","е":"e","ё":"yo","ж":"zh","з":"z","и":"i","й":"j","к":"k","л":"l","м":"m","н":"n","о":"o","п":"p","р":"r","с":"s","т":"t","у":"u","ф":"f","х":"h","ц":"ts","ч":"ch","ш":"sh","щ":"sch","ъ":"","ы":"y","ь":"","э":"e","ю":"yu","я":"ya"}[c] || c))
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function NewBlogPostPage() {
  const router = useRouter();
  const { toast } = useAdmin();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<Partial<BlogPost>>({
    title: "", slug: "", category: CATEGORIES[0],
    excerpt: "", content: "", coverImgQuery: "",
    readTime: 5, date: new Date().toISOString().slice(0, 10),
    author: { name: "Редакция Ростехсталь", role: "Специалист" },
  });

  function set(key: keyof BlogPost, value: unknown) {
    setForm(f => ({ ...f, [key]: value }));
  }

  async function uploadCover(file: File) {
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const data = await res.json();
    setUploading(false);
    if (data.url) { set("coverImgQuery", data.url); toast("Обложка загружена"); }
    else toast(data.error || "Ошибка загрузки", "error");
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault(); setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadCover(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/admin/blog", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) { toast("Статья создана"); router.push("/admin/blog"); }
    else toast("Ошибка при создании статьи", "error");
  }

  const wordCount = (form.content || "").trim().split(/\s+/).filter(Boolean).length;
  const isImageUrl = form.coverImgQuery?.startsWith("/") || form.coverImgQuery?.startsWith("http");

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
          <h1 className="text-[18px] font-bold text-slate-900">Новая статья</h1>
          <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${CATEGORY_COLORS[form.category ?? ""] ?? "bg-slate-100 text-slate-600"}`}>
            {form.category}
          </span>
        </div>
        <button type="submit" disabled={saving}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-[13px] px-4 py-2 rounded-xl transition-colors shadow-sm shadow-blue-600/25">
          {saving
            ? <><svg className="animate-spin" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>Публикация...</>
            : <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>Опубликовать</>
          }
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4">
        {/* Left: cover + meta */}
        <div className="flex flex-col gap-3">

          {/* Cover image */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col gap-3">
            <p className={lbl}>Обложка статьи</p>

            <div
              onClick={() => fileRef.current?.click()}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`relative cursor-pointer rounded-xl border-2 border-dashed transition-all overflow-hidden
                ${dragOver ? "border-blue-400 bg-blue-50" : "border-slate-200 hover:border-blue-300 hover:bg-slate-50"}`}
              style={{ minHeight: 160 }}
            >
              {isImageUrl ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={form.coverImgQuery} alt="cover" className="w-full object-cover" style={{ minHeight: 160, maxHeight: 200 }} />
                  <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-[12px] font-semibold bg-black/50 px-3 py-1.5 rounded-xl">Заменить обложку</span>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center gap-2 p-5 text-center" style={{ minHeight: 160 }}>
                  {uploading
                    ? <svg className="animate-spin text-blue-500" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                    : <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                  }
                  <p className="text-[12px] text-slate-400 font-medium">{uploading ? "Загрузка..." : "Перетащите или кликните"}</p>
                  <p className="text-[11px] text-slate-300">JPG, PNG, WebP · до 5 МБ</p>
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden"
              onChange={e => e.target.files?.[0] && uploadCover(e.target.files[0])} />

            {isImageUrl && (
              <button type="button" onClick={() => set("coverImgQuery", "")}
                className="flex items-center justify-center gap-1.5 text-[12px] text-red-400 hover:text-red-600 font-medium py-1.5 rounded-xl hover:bg-red-50 transition-colors">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
                Удалить обложку
              </button>
            )}

            {!isImageUrl && (
              <div className="flex flex-col gap-1">
                <label className={lbl}>Ключевые слова для обложки</label>
                <input value={form.coverImgQuery || ""} onChange={e => set("coverImgQuery", e.target.value)}
                  className={inp} placeholder="steel rebar construction" />
              </div>
            )}
          </div>

          {/* Meta */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col gap-3">
            <p className={lbl}>Метаданные</p>

            <div className="flex flex-col gap-1">
              <label className={lbl}>Категория</label>
              <select value={form.category} onChange={e => set("category", e.target.value)} className={inp}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1">
                <label className={lbl}>Дата</label>
                <input type="date" value={form.date?.slice(0, 10)} onChange={e => set("date", e.target.value)} className={inp} />
              </div>
              <div className="flex flex-col gap-1">
                <label className={lbl}>Чтение, мин</label>
                <input type="number" min={1} value={form.readTime} onChange={e => set("readTime", Number(e.target.value))} className={inp} />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className={lbl}>Автор</label>
              <input value={form.author?.name || ""} onChange={e => set("author", { ...form.author, name: e.target.value })}
                className={inp} placeholder="Дмитрий Ковалёв" />
            </div>

            <div className="flex flex-col gap-1">
              <label className={lbl}>Должность</label>
              <input value={form.author?.role || ""} onChange={e => set("author", { ...form.author, role: e.target.value })}
                className={inp} placeholder="Коммерческий директор" />
            </div>

            {/* Stats */}
            <div className="flex items-center gap-3 pt-1 border-t border-slate-100">
              <div className="flex-1 text-center">
                <div className="text-[18px] font-bold text-slate-900">{wordCount}</div>
                <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">слов</div>
              </div>
              <div className="w-px h-8 bg-slate-100" />
              <div className="flex-1 text-center">
                <div className="text-[18px] font-bold text-slate-900">{(form.content || "").length}</div>
                <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">символов</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: content */}
        <div className="flex flex-col gap-3">

          {/* Main fields */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col gap-3">
            <p className={lbl}>Основная информация</p>

            <div className="flex flex-col gap-1">
              <label className={lbl}>Заголовок <span className="text-red-400">*</span></label>
              <input required value={form.title}
                onChange={e => { set("title", e.target.value); set("slug", toSlug(e.target.value)); }}
                className={`${inp} text-[14px] font-medium`}
                placeholder="Как выбрать арматуру для строительства..." />
            </div>

            <div className="flex flex-col gap-1">
              <label className={lbl}>Slug (URL) <span className="text-red-400">*</span></label>
              <input required value={form.slug} onChange={e => set("slug", e.target.value)}
                className={`${inp} font-mono text-[12px]`} placeholder="kak-vybrat-armaturu" />
            </div>

            <div className="flex flex-col gap-1">
              <label className={lbl}>Краткое описание (excerpt)</label>
              <textarea rows={2} value={form.excerpt} onChange={e => set("excerpt", e.target.value)}
                className={`${inp} resize-none`} placeholder="Разбираем ключевые отличия марок стали..." />
            </div>
          </div>

          {/* Content editor */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col gap-3 flex-1">
            <div className="flex items-center justify-between">
              <p className={lbl}>Текст статьи (Markdown)</p>
              <button type="button" onClick={() => setPreview(p => !p)}
                className={`text-[11px] font-semibold px-2.5 py-1 rounded-xl transition-colors ${
                  preview ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}>
                {preview ? "← Редактор" : "Превью →"}
              </button>
            </div>

            {/* Markdown toolbar */}
            {!preview && (
              <div className="flex items-center gap-1 flex-wrap">
                {[
                  { label: "H2", insert: "\n## " },
                  { label: "H3", insert: "\n### " },
                  { label: "B", insert: "****", bold: true },
                  { label: "—", insert: "\n\n---\n\n" },
                  { label: "• Список", insert: "\n- " },
                  { label: "1. Список", insert: "\n1. " },
                ].map(btn => (
                  <button key={btn.label} type="button"
                    onClick={() => set("content", (form.content || "") + btn.insert)}
                    className={`px-2 py-1 text-[11px] rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors ${btn.bold ? "font-black" : "font-semibold"}`}>
                    {btn.label}
                  </button>
                ))}
              </div>
            )}

            {preview ? (
              <div className="prose prose-sm max-w-none p-4 bg-slate-50 rounded-xl border border-slate-200 overflow-y-auto"
                style={{ minHeight: 340 }}>
                {(form.content || "").split("\n").map((line, i) => {
                  if (line.startsWith("## ")) return <h2 key={i} className="text-[16px] font-bold text-slate-900 mt-4 mb-1">{line.slice(3)}</h2>;
                  if (line.startsWith("### ")) return <h3 key={i} className="text-[14px] font-bold text-slate-800 mt-3 mb-1">{line.slice(4)}</h3>;
                  if (line.startsWith("- ")) return <li key={i} className="text-[13px] text-slate-700 ml-4">{line.slice(2)}</li>;
                  if (line === "---") return <hr key={i} className="my-3 border-slate-200" />;
                  if (line === "") return <br key={i} />;
                  return <p key={i} className="text-[13px] text-slate-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }} />;
                })}
              </div>
            ) : (
              <textarea
                value={form.content || ""}
                onChange={e => set("content", e.target.value)}
                className={`${inp} resize-y font-mono text-[12px] leading-relaxed`}
                style={{ minHeight: 340 }}
                placeholder={"## Введение\n\nТекст статьи...\n\n## Раздел\n\n- Пункт 1\n- Пункт 2"}
              />
            )}
            <p className="text-[11px] text-slate-400">
              ## Заголовок &nbsp;·&nbsp; ### Подзаголовок &nbsp;·&nbsp; **жирный** &nbsp;·&nbsp; - список &nbsp;·&nbsp; --- разделитель
            </p>
          </div>
        </div>
      </div>

      {/* Mobile save */}
      <button type="submit" disabled={saving}
        className="lg:hidden w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors text-[14px]">
        {saving ? "Публикация..." : "Опубликовать статью"}
      </button>
    </form>
  );
}

const inp = "w-full border border-slate-200 rounded-xl px-3 py-2 text-[13px] outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 bg-white transition-colors";
const lbl = "text-[11px] font-semibold text-slate-500 uppercase tracking-wide";
