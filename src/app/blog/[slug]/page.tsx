"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { blogPosts, BlogPost } from "@/data/blog";
import { useOrderModal } from "@/context/ModalContext";

/* ═════════════ Icons ═════════════ */
const ChevronRight = () => (
  <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden>
    <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const ClockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
  </svg>
);
const CalendarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const TelegramIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
);
const WhatsAppIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
);
const LinkIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
);
const ArrowLeft = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
);

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
}

function slugifyHeading(text: string): string {
  return text.toLowerCase()
    .replace(/[а-яё]/g, c => ({"а":"a","б":"b","в":"v","г":"g","д":"d","е":"e","ё":"yo","ж":"zh","з":"z","и":"i","й":"j","к":"k","л":"l","м":"m","н":"n","о":"o","п":"p","р":"r","с":"s","т":"t","у":"u","ф":"f","х":"h","ц":"ts","ч":"ch","ш":"sh","щ":"sch","ъ":"","ы":"y","ь":"","э":"e","ю":"yu","я":"ya"}[c] || c))
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

/* ═════════════ Markdown rendering ═════════════ */
function mdInline(text: string): string {
  return text
    // [текст](/path) — внутренние ссылки для перелинковки (SEO)
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" class="text-brand-primary font-semibold underline underline-offset-2 decoration-brand-primary/30 hover:decoration-brand-primary transition-colors">$1</a>'
    )
    .replace(/\*\*(.*?)\*\*/g, "<strong class='font-bold text-gray-900'>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em class='italic'>$1</em>")
    .replace(/`(.*?)`/g, '<code class="bg-blue-50 text-brand-primary px-1.5 py-0.5 rounded text-[0.9em] font-mono">$1</code>');
}

interface Heading { id: string; text: string; level: 2 | 3 }

function ArticleContent({ content, onHeadings }: { content: string; onHeadings: (h: Heading[]) => void }) {
  const { elements, headings } = useMemo(() => {
    const lines = content.trim().split("\n");
    const elements: React.ReactNode[] = [];
    const headings: Heading[] = [];
    let key = 0;
    let tableRows: string[][] = [];
    let inTable = false;
    let listBuffer: React.ReactNode[] = [];
    let listOrdered = false;

    function flushList() {
      if (!listBuffer.length) return;
      const Tag = listOrdered ? "ol" : "ul";
      elements.push(
        <Tag key={key++} className={`my-5 flex flex-col gap-2 ${listOrdered ? "list-decimal pl-5" : ""}`}>
          {listBuffer}
        </Tag>
      );
      listBuffer = [];
    }

    function flushTable() {
      if (tableRows.length < 2) { tableRows = []; inTable = false; return; }
      const [header, , ...body] = tableRows;
      elements.push(
        <div key={key++} className="my-8 overflow-x-auto rounded-2xl border border-gray-200">
          <table className="w-full text-[14px] border-collapse min-w-[420px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {header.map((h, i) => (
                  <th key={i} className="text-left px-4 py-3 font-bold text-gray-900 text-[13px] uppercase tracking-wide">{h.trim()}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {body.map((row, ri) => (
                <tr key={ri} className="hover:bg-gray-50/60 transition-colors">
                  {row.map((cell, ci) => (
                    <td key={ci} className="px-4 py-3 text-gray-700">{cell.trim()}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      tableRows = []; inTable = false;
    }

    for (const raw of lines) {
      const line = raw.trimEnd();

      // Table
      if (line.startsWith("|")) {
        flushList();
        inTable = true;
        tableRows.push(line.split("|").filter((_, i, a) => i > 0 && i < a.length - 1));
        continue;
      }
      if (inTable) flushTable();

      // List items
      if (line.startsWith("- ") || line.startsWith("* ")) {
        listOrdered = false;
        listBuffer.push(
          <li key={key++} className="flex items-start gap-3 text-[16px] text-gray-700 leading-relaxed">
            <span className="mt-[10px] w-1.5 h-1.5 rounded-full bg-brand-primary shrink-0" />
            <span dangerouslySetInnerHTML={{ __html: mdInline(line.slice(2)) }} />
          </li>
        );
        continue;
      }
      if (/^\d+\.\s/.test(line)) {
        listOrdered = true;
        listBuffer.push(
          <li key={key++} className="text-[16px] text-gray-700 leading-relaxed marker:text-brand-primary marker:font-bold pl-1">
            <span dangerouslySetInnerHTML={{ __html: mdInline(line.replace(/^\d+\.\s/, "")) }} />
          </li>
        );
        continue;
      }
      flushList();

      // Empty line spacer
      if (!line) { elements.push(<div key={key++} className="h-2" />); continue; }

      // Blockquote
      if (line.startsWith("> ")) {
        elements.push(
          <blockquote key={key++} className="my-6 pl-5 py-1 border-l-4 border-brand-primary bg-blue-50/40 rounded-r-xl">
            <p className="text-[17px] italic text-gray-700 leading-relaxed py-3 pr-4"
              dangerouslySetInnerHTML={{ __html: mdInline(line.slice(2)) }} />
          </blockquote>
        );
        continue;
      }

      // Divider
      if (line === "---" || line === "***") {
        elements.push(<hr key={key++} className="my-10 border-gray-200" />);
        continue;
      }

      // Headings
      if (line.startsWith("## ")) {
        const text = line.slice(3);
        const id = slugifyHeading(text);
        headings.push({ id, text, level: 2 });
        elements.push(
          <h2 key={key++} id={id} className="text-[24px] sm:text-[28px] font-bold text-gray-900 mt-12 mb-4 tracking-tight scroll-mt-24">
            {text}
          </h2>
        );
        continue;
      }
      if (line.startsWith("### ")) {
        const text = line.slice(4);
        const id = slugifyHeading(text);
        headings.push({ id, text, level: 3 });
        elements.push(
          <h3 key={key++} id={id} className="text-[18px] sm:text-[20px] font-bold text-gray-900 mt-8 mb-3 tracking-tight scroll-mt-24">
            {text}
          </h3>
        );
        continue;
      }

      // Standalone bold (sub-heading-ish)
      if (line.startsWith("**") && line.endsWith("**") && line.length > 4) {
        elements.push(
          <p key={key++} className="text-[16px] font-bold text-gray-900 mt-5 mb-1">{line.slice(2, -2)}</p>
        );
        continue;
      }

      // Paragraph
      elements.push(
        <p key={key++} className="text-[16px] sm:text-[17px] text-gray-700 leading-[1.75] my-3"
          dangerouslySetInnerHTML={{ __html: mdInline(line) }} />
      );
    }
    flushList();
    if (inTable) flushTable();

    return { elements, headings };
  }, [content]);

  useEffect(() => { onHeadings(headings); }, [headings, onHeadings]);

  return <div className="flex flex-col">{elements}</div>;
}

/* ═════════════ Related card ═════════════ */
function RelatedCard({ post, compact = false }: { post: BlogPost; compact?: boolean }) {
  const [imgErr, setImgErr] = useState(false);
  const src = `https://source.unsplash.com/${compact ? "160x128" : "400x250"}/?${encodeURIComponent(post.coverImgQuery)}`;

  if (compact) {
    return (
      <Link href={`/blog/${post.slug}`}
        className="group flex gap-3 items-start p-2.5 rounded-xl hover:bg-gray-50 transition-all">
        <div className="w-16 h-14 rounded-lg overflow-hidden bg-gray-100 shrink-0">
          {!imgErr && <img src={src} alt={post.title} onError={() => setImgErr(true)} className="w-full h-full object-cover" />}
        </div>
        <div className="flex flex-col gap-1 min-w-0">
          <span className="text-[10px] font-bold uppercase tracking-widest text-brand-primary">{post.category}</span>
          <p className="text-[13px] font-semibold text-gray-900 leading-snug group-hover:text-brand-primary transition-colors line-clamp-2">
            {post.title}
          </p>
          <span className="text-[11px] text-gray-400">{post.readTime} мин</span>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/blog/${post.slug}`}
      className="group bg-white border border-gray-200 hover:border-gray-300 hover:shadow-lg rounded-2xl overflow-hidden flex flex-col transition-all duration-200">
      <div className="relative bg-gradient-to-br from-slate-100 to-slate-200 aspect-[16/10] overflow-hidden">
        {!imgErr && <img src={src} alt={post.title} onError={() => setImgErr(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />}
      </div>
      <div className="flex flex-col gap-2 p-5 flex-1">
        <span className="text-[10px] font-bold uppercase tracking-widest text-brand-primary">{post.category}</span>
        <p className="text-[14px] font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-brand-primary transition-colors">
          {post.title}
        </p>
        <p className="text-[12px] text-gray-500 line-clamp-2 leading-relaxed">{post.excerpt}</p>
        <div className="mt-auto pt-2 flex items-center gap-2 text-[11px] text-gray-400">
          <ClockIcon /> {post.readTime} мин · {formatDate(post.date)}
        </div>
      </div>
    </Link>
  );
}

/* ═════════════ Share button row ═════════════ */
function ShareButtons({ post, vertical = false }: { post: BlogPost; vertical?: boolean }) {
  const [copied, setCopied] = useState(false);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "";
  const url = typeof window !== "undefined" ? window.location.href : `${siteUrl}/blog/${post.slug}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  }

  const wrapCls = vertical
    ? "flex flex-col gap-2"
    : "flex items-center gap-2 flex-wrap";
  const btnCls = "inline-flex items-center justify-center gap-2 w-10 h-10 rounded-full border transition-all";
  const labelBtnCls = "inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-[12px] border transition-all";

  if (vertical) {
    return (
      <div className={wrapCls}>
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1 text-center">Поделиться</p>
        <a href={`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(post.title)}`}
          target="_blank" rel="noopener noreferrer" title="Telegram"
          className={`${btnCls} bg-[#2AABEE]/10 text-[#0088cc] border-[#2AABEE]/20 hover:bg-[#2AABEE]/20`}>
          <TelegramIcon />
        </a>
        <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(post.title + " " + url)}`}
          target="_blank" rel="noopener noreferrer" title="WhatsApp"
          className={`${btnCls} bg-[#25D366]/10 text-[#128C7E] border-[#25D366]/20 hover:bg-[#25D366]/20`}>
          <WhatsAppIcon />
        </a>
        <button onClick={copyLink} title="Скопировать ссылку"
          className={`${btnCls} ${copied ? "bg-green-100 text-green-600 border-green-200" : "bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200"}`}>
          {copied
            ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
            : <LinkIcon />}
        </button>
      </div>
    );
  }

  return (
    <div className={wrapCls}>
      <span className="text-[13px] font-semibold text-gray-600 mr-1">Поделиться:</span>
      <a href={`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(post.title)}`}
        target="_blank" rel="noopener noreferrer"
        className={`${labelBtnCls} bg-[#2AABEE]/10 text-[#0088cc] border-[#2AABEE]/20 hover:bg-[#2AABEE]/20`}>
        <TelegramIcon /> Telegram
      </a>
      <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(post.title + " " + url)}`}
        target="_blank" rel="noopener noreferrer"
        className={`${labelBtnCls} bg-[#25D366]/10 text-[#128C7E] border-[#25D366]/20 hover:bg-[#25D366]/20`}>
        <WhatsAppIcon /> WhatsApp
      </a>
      <button onClick={copyLink}
        className={`${labelBtnCls} ${copied ? "bg-green-100 text-green-600 border-green-200" : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"}`}>
        {copied
          ? <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg> Скопировано</>
          : <><LinkIcon /> Ссылка</>}
      </button>
    </div>
  );
}

/* ═════════════ Main page ═════════════ */
export default function BlogPostPage() {
  const params = useParams();
  const slug = typeof params?.slug === "string" ? params.slug : Array.isArray(params?.slug) ? params.slug[0] : "";
  const { openModal } = useOrderModal();
  const [imgErr, setImgErr] = useState(false);
  const [progress, setProgress] = useState(0);
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const articleRef = useRef<HTMLDivElement>(null);

  const post = blogPosts.find((p) => p.slug === slug);
  const related = blogPosts.filter((p) => p.slug !== slug && p.category === post?.category).slice(0, 3);
  const fallbackRelated = blogPosts.filter((p) => p.slug !== slug).slice(0, 3);
  const relatedFinal = related.length ? related : fallbackRelated;

  /* Reading progress */
  useEffect(() => {
    function onScroll() {
      const el = articleRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      const scrolled = -rect.top;
      const pct = Math.max(0, Math.min(100, (scrolled / total) * 100));
      setProgress(pct);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [post]);

  /* Active heading (TOC highlight) */
  useEffect(() => {
    if (!headings.length) return;
    function onScroll() {
      const offset = 120;
      let current = headings[0].id;
      for (const h of headings) {
        const el = document.getElementById(h.id);
        if (el && el.getBoundingClientRect().top - offset <= 0) current = h.id;
      }
      setActiveId(current);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [headings]);

  if (!post) {
    return (
      <div className="container py-24 flex flex-col items-center gap-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-300">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </div>
        <p className="text-[20px] font-bold text-gray-900">Статья не найдена</p>
        <p className="text-[14px] text-gray-500">Возможно, материал был удалён или ссылка неверна</p>
        <Link href="/blog" className="mt-2 inline-flex items-center gap-2 bg-brand-primary text-white font-semibold text-[14px] px-6 py-3 rounded-full hover:bg-brand-primary/90 transition-all">
          <ArrowLeft /> Вернуться в блог
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col pb-20 bg-white">

      {/* ── Progress bar (top) ── */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-transparent z-[60] pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-brand-primary via-blue-500 to-blue-400 transition-[width] duration-150 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* ── Breadcrumb ── */}
      <div className="border-b border-gray-100 bg-white">
        <div className="container py-3.5">
          <nav className="flex items-center gap-1.5 text-[12px] font-semibold text-gray-400 flex-wrap">
            <Link href="/" className="hover:text-gray-700 transition-colors">Главная</Link>
            <ChevronRight />
            <Link href="/blog" className="hover:text-gray-700 transition-colors">Блог</Link>
            <ChevronRight />
            <span className="text-gray-700 line-clamp-1">{post.title}</span>
          </nav>
        </div>
      </div>

      {/* ── Unified hero + article + sidebar grid ── */}
      <div className="container pt-6 sm:pt-10 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_320px] gap-8 lg:gap-10 xl:gap-14 items-start">

          {/* MAIN COLUMN */}
          <div className="flex flex-col min-w-0">

            {/* ── Hero ── */}
            <header className="flex flex-col gap-5 sm:gap-6">
              {/* Back + category */}
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <Link href="/blog" className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-gray-400 hover:text-gray-700 transition-colors">
                  <ArrowLeft /> Все статьи
                </Link>
                <span className="px-3 py-1.5 bg-brand-primary/10 text-brand-primary text-[11px] font-bold rounded-full uppercase tracking-widest">
                  {post.category}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-[26px] sm:text-[36px] lg:text-[40px] xl:text-[44px] font-bold text-gray-900 tracking-tighter leading-[1.15]">
                {post.title}
              </h1>

              {/* Excerpt */}
              <p className="text-[15px] sm:text-[17px] text-gray-500 leading-relaxed font-medium">
                {post.excerpt}
              </p>

              {/* Author + meta strip */}
              <div className="flex items-center justify-between gap-4 flex-wrap pt-5 mt-1 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-brand-primary to-blue-500 flex items-center justify-center text-white text-[15px] font-bold shadow-sm shadow-brand-primary/20">
                    {post.author.name.split(" ").map(s => s[0]).slice(0, 2).join("")}
                  </div>
                  <div className="flex flex-col leading-tight">
                    <span className="text-[14px] font-bold text-gray-900">{post.author.name}</span>
                    <span className="text-[12px] text-gray-400">{post.author.role}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 sm:gap-4 text-[12px] text-gray-500 font-medium flex-wrap">
                  <span className="inline-flex items-center gap-1.5"><CalendarIcon /> {formatDate(post.date)}</span>
                  <span className="inline-flex items-center gap-1.5"><ClockIcon /> {post.readTime} мин чтения</span>
                </div>
              </div>
            </header>

            {/* ── Cover image ── */}
            <div className="relative bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl sm:rounded-3xl overflow-hidden aspect-[16/9] mt-6 sm:mt-8 shadow-lg shadow-gray-200/50">
              {!imgErr ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={`https://source.unsplash.com/1600x900/?${encodeURIComponent(post.coverImgQuery)}`}
                  alt={post.title}
                  onError={() => setImgErr(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-7xl">📰</div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
            </div>

            {/* ── Article body ── */}
            <article ref={articleRef} className="mt-8 sm:mt-12">
              <ArticleContent content={post.content} onHeadings={setHeadings} />

              {/* End-of-article share */}
              <div className="mt-12 pt-8 border-t border-gray-100">
                <ShareButtons post={post} />
              </div>

              {/* Author bio card */}
              <div className="mt-8 p-5 sm:p-7 bg-gradient-to-br from-blue-50/50 to-gray-50 border border-gray-200/60 rounded-2xl sm:rounded-3xl flex items-start gap-4 sm:gap-5">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-brand-primary to-blue-500 flex items-center justify-center text-white text-[18px] sm:text-[20px] font-bold shadow-md shadow-brand-primary/20 shrink-0">
                  {post.author.name.split(" ").map(s => s[0]).slice(0, 2).join("")}
                </div>
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-brand-primary">Автор статьи</span>
                  <p className="text-[16px] sm:text-[17px] font-bold text-gray-900">{post.author.name}</p>
                  <p className="text-[13px] text-gray-500">{post.author.role}</p>
                  <p className="text-[13px] text-gray-500 leading-relaxed mt-2">
                    Эксперт компании «Ростехсталь» с опытом работы в металлоторговле. Помогает клиентам подобрать оптимальные решения по сортаменту и цене.
                  </p>
                </div>
              </div>
            </article>
          </div>

          {/* SIDEBAR (desktop only) */}
          <aside className="hidden lg:flex flex-col gap-5 sticky top-24 self-start">

            {/* Table of contents */}
            {headings.length > 1 && (
              <div className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col gap-2">
                <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1">Содержание</p>
                <ul className="flex flex-col gap-0.5 max-h-[50vh] overflow-y-auto">
                  {headings.map((h) => (
                    <li key={h.id}>
                      <a href={`#${h.id}`}
                        className={`block py-1.5 px-3 rounded-lg text-[13px] leading-snug transition-all border-l-2 ${
                          activeId === h.id
                            ? "border-brand-primary text-brand-primary font-semibold bg-blue-50/60"
                            : "border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                        } ${h.level === 3 ? "pl-6 text-[12px]" : ""}`}>
                        {h.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Share */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col gap-3">
              <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Поделиться</p>
              <ShareButtons post={post} />
            </div>

            {/* CTA */}
            <div className="relative overflow-hidden bg-gradient-to-br from-brand-primary to-blue-500 rounded-2xl p-6 flex flex-col gap-4 text-white shadow-lg shadow-brand-primary/20">
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
              <div className="relative">
                <p className="text-[16px] font-bold leading-snug mb-2">Нужна помощь с выбором металлопроката?</p>
                <p className="text-[13px] text-blue-100 leading-relaxed">Менеджер рассчитает стоимость и подберёт нужную марку за 30 минут.</p>
              </div>
              <button onClick={openModal}
                className="relative inline-flex items-center justify-center gap-2 bg-white text-brand-primary font-bold text-[13px] px-5 py-3 rounded-xl hover:bg-blue-50 active:scale-[0.98] transition-all">
                Оставить заявку
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>

            {/* Related compact */}
            {relatedFinal.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col gap-1">
                <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2 px-2">Похожие статьи</p>
                {relatedFinal.slice(0, 3).map((p) => <RelatedCard key={p.id} post={p} compact />)}
              </div>
            )}
          </aside>

        </div>
      </div>

      {/* ── Mobile CTA ── */}
      <div className="container mt-12 lg:hidden">
        <div className="relative overflow-hidden bg-gradient-to-br from-brand-primary to-blue-500 rounded-3xl p-6 sm:p-8 flex flex-col gap-4 text-white shadow-lg shadow-brand-primary/20">
          <div className="absolute -top-16 -right-16 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
          <div className="relative flex flex-col gap-2">
            <p className="text-[18px] sm:text-[22px] font-bold leading-snug">Нужна помощь с выбором металлопроката?</p>
            <p className="text-[14px] text-blue-100 leading-relaxed">Менеджер рассчитает стоимость и подберёт нужную марку за 30 минут.</p>
          </div>
          <button onClick={openModal}
            className="relative self-start inline-flex items-center justify-center gap-2 bg-white text-brand-primary font-bold text-[14px] px-6 py-3 rounded-full hover:bg-blue-50 transition-all">
            Оставить заявку
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
      </div>

      {/* ── Related articles grid ── */}
      {relatedFinal.length > 0 && (
        <section className="container mt-16 sm:mt-20">
          <div className="flex items-end justify-between gap-4 mb-6 sm:mb-8 pb-4 border-b border-gray-200">
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-bold uppercase tracking-widest text-brand-primary">Дальше читать</span>
              <h2 className="text-[22px] sm:text-[28px] font-bold tracking-tight text-gray-900">Похожие статьи</h2>
            </div>
            <Link href="/blog" className="hidden sm:inline-flex items-center gap-1.5 text-[13px] font-semibold text-gray-500 hover:text-gray-900 transition-colors shrink-0">
              Все статьи →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {relatedFinal.map((p) => <RelatedCard key={p.id} post={p} />)}
          </div>
        </section>
      )}

    </div>
  );
}
