"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { products, Product } from "@/data/catalog";
import { ProductCard } from "@/components/features/catalog/ProductCard";
import { useOrderModal } from "@/context/ModalContext";
import { CONTACTS } from "@/lib/constants";

/* ── Иконки ── */
const ArrowRight = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden>
    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
    <path d="M2.5 7L5.5 10L11.5 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const WhatsAppIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
  </svg>
);
const PhoneCallIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 5.49 5.49l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

/* ── Данные ── */
const STATS = [
  { value: "5 000+", label: "Успешных поставок", sub: "за всё время" },
  { value: "1 200+", label: "Постоянных клиентов", sub: "строительные и промышленные" },
  { value: "3+", label: "года на рынке", sub: "в Кыргызстане" },
  { value: "1000+", label: "Позиций на складе", sub: "всегда в наличии" },
];

/* Реальные преимущества с rostehstal.kg */
const FEATURES = [
  {
    dark: true,
    title: "Широкий ассортимент",
    desc: "Стальные листы, трубы, профили, арматура, уголки, швеллеры, балки — всё для строительных и промышленных проектов любого масштаба, всегда в наличии на складе в Бишкеке.",
    items: ["Чёрный и цветной прокат", "Нержавеющий металл", "Трубопроводная арматура", "Метизы и сварочные материалы"],
    cta: true,
  },
  {
    title: "Конкурентные цены",
    desc: "Прямые контракты с заводами-производителями России, Казахстана и Китая. Стабильные партнёрские отношения позволяют предлагать заводскую цену без наценок дистрибьюторов.",
  },
  {
    title: "Соблюдение сроков",
    desc: "Оперативная доставка металла на строительный объект в оговорённые сроки — в день оплаты.",
  },
  {
    blue: true,
    wide: true,
    title: "Инновационный подход",
    desc: "Внедряем современные стандарты качества, систему ЭДО и онлайн-инструменты для клиентов. Постоянно растём — вместе с вашим бизнесом.",
  },
];

const STEPS = [
  { n: "01", title: "Оставьте заявку", desc: "Укажите нужный металл, размер и объём. Займёт 2 минуты." },
  { n: "02", title: "Получите расчёт", desc: "Отдел продаж пришлёт КП с ценой и сроком за 30 минут." },
  { n: "03", title: "Подпишите договор", desc: "ЭДО или бумажный договор — как удобнее вашему бухгалтеру." },
  { n: "04", title: "Получите металл", desc: "Доставим на объект собственным транспортом в день оплаты." },
];

const POPULAR_PRODUCT_SLUGS = [
  "truba-profilnaya-40x40x2",
  "armatura-a500s-12mm",
  "list-gk-3mm-st3",
  "ugolok-stalnoy-50x50x5",
];

const HERO_SLIDES = [
  "/images/hero/hero-metal-yard.jpg",
  "/images/hero/hero-warehouse-rebar.jpg",
  "/images/hero/hero-clean-stock.jpg",
];

const VIDEO_ID = "dQw4w9WgXcQ"; // замените на реальный YouTube ID

const PlayIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M8 5.14v14l11-7-11-7z" />
  </svg>
);

/* ── Страница ── */
export default function HomePage() {
  const { openModal } = useOrderModal();
  const [videoPlaying, setVideoPlaying] = useState(false); // для секции видео
  const [heroSlide, setHeroSlide] = useState(0);
  const popularProducts = POPULAR_PRODUCT_SLUGS
    .map((slug) => products.find((product) => product.slug === slug))
    .filter((product): product is Product => Boolean(product));

  useEffect(() => {
    const timer = window.setInterval(() => {
      setHeroSlide((current) => (current + 1) % HERO_SLIDES.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col pb-0 font-sans">

      {/* ═══════════ HERO ═══════════ */}
      <section className="relative isolate pt-12 sm:pt-20 pb-20 sm:pb-28 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
          {HERO_SLIDES.map((slide, index) => (
            <div
              key={slide}
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-out ${
                index === heroSlide ? "opacity-100" : "opacity-0"
              }`}
              style={{ backgroundImage: `url(${slide})` }}
            />
          ))}
          <div className="absolute inset-0 backdrop-blur-[1px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-blue-50/74 to-white/94" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_65%_at_50%_12%,rgba(191,219,254,0.68),rgba(239,246,255,0.48)_42%,transparent_72%)]" />
          <div className="absolute left-1/2 top-6 h-56 w-[min(760px,92vw)] -translate-x-1/2 rounded-full bg-blue-400/18 blur-3xl" />
          <div className="absolute inset-x-0 bottom-5 flex justify-center gap-2">
            {HERO_SLIDES.map((slide, index) => (
              <span
                key={`${slide}-dot`}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  index === heroSlide ? "w-8 bg-brand-primary/80" : "w-1.5 bg-gray-400/50"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="container">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto gap-6">


            <h1 className="text-[28px] xs:text-[32px] sm:text-[44px] md:text-[54px] lg:text-[66px] font-bold tracking-tighter text-gray-950 leading-[1.1] sm:leading-[1.05] drop-shadow-sm">
              Крупнейшая металлобаза<br className="hidden sm:block" />
              <span className="text-brand-primary">
                {" "}по металлопрокату в Кыргызстане
              </span>
            </h1>

            <p className="text-[14px] sm:text-[16px] md:text-[18px] text-gray-700 max-w-2xl leading-relaxed font-semibold drop-shadow-sm">
              Стальные листы, трубы, профили, арматура и спецсталь — широкий ассортимент металлопродукции высокого качества для строительных и промышленных предприятий.
            </p>

            {/* CTA кнопки */}
            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 mt-2 w-full sm:w-auto">
              <Link
                href="/catalog"
                className="inline-flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-primary/90 active:scale-[0.98] text-white font-semibold text-[14px] sm:text-[15px] px-6 sm:px-7 py-3.5 rounded-full shadow-md hover:shadow-lg transition-all duration-200"
              >
                Перейти в каталог <ArrowRight />
              </Link>
              <a
                href={`https://${CONTACTS.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#22c05c] active:scale-[0.98] text-white font-semibold text-[14px] sm:text-[15px] px-6 sm:px-7 py-3.5 rounded-full shadow-sm hover:shadow-md transition-all duration-200"
              >
                <WhatsAppIcon /> Написать в WhatsApp
              </a>
              <Link
                href="/calculator"
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 active:scale-[0.98] text-gray-800 font-semibold text-[14px] sm:text-[15px] px-6 sm:px-7 py-3.5 rounded-full border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200"
              >
                Калькулятор
              </Link>
            </div>

            {/* Trust */}
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-2 text-[13px] font-semibold text-gray-500">
              {["3 года на рынке", "Доставка в день оплаты", "ЭДО и онлайн-расчёт"].map((t) => (
                <span key={t} className="flex items-center gap-1.5">
                  <span className="text-green-500"><CheckIcon /></span> {t}
                </span>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ═══════════ STATS ═══════════ */}
      <section className="py-14 sm:py-16 bg-white border-y border-gray-100">
        <div className="container">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-gray-100 border border-gray-100 rounded-2xl overflow-hidden">
            {STATS.map((s, i) => (
              <div key={i} className="flex flex-col gap-1 p-4 sm:p-6 lg:p-8 bg-white hover:bg-gray-50/60 transition-colors">
                <span className="text-[24px] sm:text-[32px] lg:text-[38px] font-bold tracking-tighter text-gray-900 leading-none">{s.value}</span>
                <span className="text-[12px] sm:text-[13px] font-bold text-gray-900 mt-1">{s.label}</span>
                <span className="text-[11px] sm:text-[12px] text-gray-400 font-medium">{s.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ ВИДЕО + ГАЛЕРЕЯ ═══════════ */}
      <section className="py-20 sm:py-24">
        <div className="container flex flex-col gap-14">

          {/* Заголовок */}
          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-bold uppercase tracking-widest text-brand-primary">О компании</span>
            <h2 className="text-[22px] sm:text-[28px] md:text-[36px] font-bold tracking-tight text-gray-900">
              Посмотрите, как мы работаем
            </h2>
          </div>

          {/* Видео + текст */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-center">

            {/* Видео */}
            <div className="lg:col-span-3">
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-900 shadow-2xl shadow-gray-900/20">
                {!videoPlaying ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/images/profile-pipes.png"
                      alt="Видео о компании Ростехсталь"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gray-900/40" />
                    <button
                      onClick={() => setVideoPlaying(true)}
                      className="absolute inset-0 flex flex-col items-center justify-center gap-4 group"
                      aria-label="Смотреть видео"
                    >
                      <div className="w-20 h-20 rounded-full bg-white/95 group-hover:bg-white flex items-center justify-center shadow-2xl shadow-black/30 group-hover:scale-110 transition-all duration-300 text-brand-primary pl-1">
                        <PlayIcon />
                      </div>
                      <span className="text-white font-semibold text-[15px] drop-shadow">Смотреть видео о компании</span>
                    </button>
                  </>
                ) : (
                  <iframe
                    src={`https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&rel=0`}
                    title="Ростехсталь — видео о компании"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  />
                )}
              </div>
            </div>

            {/* Текст */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              <h3 className="text-[22px] sm:text-[26px] font-bold text-gray-900 tracking-tight leading-snug">
                Ростехсталь — ведущая металлобаза Кыргызстана
              </h3>
              <p className="text-[15px] text-gray-500 leading-relaxed">
                Мы поставляем металлопрокат для строительных и промышленных предприятий по всему Кыргызстану.
              </p>
              <ul className="flex flex-col gap-3">
                {[
                  "Прямые поставки с заводов России, Казахстана и Китая",
                  "Быстрая доставка по всему Кыргызстану",
                  "Индивидуальные условия для крупных заказчиков",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[14px] text-gray-600 font-medium">
                    <span className="mt-0.5 w-5 h-5 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center shrink-0">
                      <CheckIcon />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <button
                onClick={openModal}
                className="mt-2 inline-flex items-center gap-2 bg-brand-primary hover:bg-brand-primary/90 active:scale-[0.98] text-white font-semibold text-[14px] px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-all w-fit"
              >
                Оставить заявку <ArrowRight />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* ═══════════ FEATURES BENTO ═══════════ */}
      <section className="py-20 sm:py-24">
        <div className="container flex flex-col gap-10">

          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-bold uppercase tracking-widest text-brand-primary">Почему выбирают нас</span>
            <h2 className="text-[22px] sm:text-[28px] md:text-[36px] font-bold tracking-tight text-gray-900">
              Надёжный партнёр для вашего бизнеса
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

            {/* Большая тёмная карточка — Широкий ассортимент */}
            <div className="md:col-span-2 lg:col-span-1 lg:row-span-2 bg-[#0d1117] text-white rounded-3xl p-8 flex flex-col gap-5 min-h-[280px] lg:min-h-0">
              <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center text-white text-[13px] font-bold">01</div>
              <div className="flex flex-col gap-3 flex-1">
                <h3 className="text-[20px] font-bold tracking-tight">Широкий ассортимент</h3>
                <p className="text-[14px] text-gray-400 leading-relaxed">
                  Стальные листы, трубы, профили, арматура, уголки, швеллеры — всё для строительных и промышленных проектов. Более 500 позиций в наличии и под заказ.
                </p>
                <ul className="mt-2 flex flex-col gap-2">
                  {["Чёрный и цветной прокат", "Нержавеющий металл", "Трубопроводная арматура", "Метизы и спецсталь"].map(item => (
                    <li key={item} className="flex items-center gap-2 text-[13px] text-gray-400 font-medium">
                      <span className="text-green-400 shrink-0"><CheckIcon /></span> {item}
                    </li>
                  ))}
                </ul>
              </div>
              <button
                onClick={openModal}
                className="mt-auto inline-flex items-center gap-2 text-[13px] font-semibold text-white/60 hover:text-white transition-colors"
              >
                Получить расчёт <ArrowRight size={14} />
              </button>
            </div>

            {/* Конкурентные цены */}
            <div className="bg-gray-50 border border-gray-200/60 rounded-3xl p-7 flex flex-col gap-4">
              <div className="w-11 h-11 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center text-brand-primary text-[13px] font-bold">02</div>
              <h3 className="text-[17px] font-bold text-gray-900 tracking-tight">Конкурентные цены</h3>
              <p className="text-[14px] text-gray-500 leading-relaxed">
                Прямые контракты с заводами РФ, Казахстана и Китая. Заводская цена без наценок дистрибьюторов.
              </p>
            </div>

            {/* Соблюдение сроков */}
            <div className="bg-gray-50 border border-gray-200/60 rounded-3xl p-7 flex flex-col gap-4">
              <div className="w-11 h-11 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center text-brand-primary text-[13px] font-bold">03</div>
              <h3 className="text-[17px] font-bold text-gray-900 tracking-tight">Соблюдение сроков</h3>
              <p className="text-[14px] text-gray-500 leading-relaxed">
                Оперативная доставка металлопроката по всему Кыргызстану в день оплаты.
              </p>
            </div>

            {/* Широкая карточка — Инновационный подход */}
            <div className="md:col-span-2 bg-blue-600 text-white rounded-3xl p-7 flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center text-white text-[13px] font-bold shrink-0">04</div>
              <div className="flex flex-col gap-2">
                <h3 className="text-[17px] font-bold tracking-tight">Инновационный подход</h3>
                <p className="text-[14px] text-blue-100 leading-relaxed max-w-lg">
                  Современные стандарты качества, система ЭДО, онлайн-калькулятор и быстрый расчёт КП.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════ ПРОДУКТЫ ═══════════ */}
      <section className="py-20 sm:py-24 bg-gray-50/50">
        <div className="container flex flex-col gap-10">

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pb-6 border-b border-gray-200">
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-bold uppercase tracking-widest text-brand-primary">Складской ассортимент</span>
              <h2 className="text-[22px] sm:text-[28px] md:text-[36px] font-bold tracking-tight text-gray-900">Популярные позиции</h2>
            </div>
            <Link href="/catalog" className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-gray-500 hover:text-gray-900 transition-colors">
              Весь каталог <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {popularProducts.map((product) => (
              <ProductCard key={product.id} product={product} hideSize hideMeta />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ КАК МЫ РАБОТАЕМ ═══════════ */}
      <section className="py-20 sm:py-24">
        <div className="container flex flex-col gap-10">

          <div className="flex flex-col gap-2 max-w-lg">
            <span className="text-[11px] font-bold uppercase tracking-widest text-brand-primary">Как мы работаем</span>
            <h2 className="text-[22px] sm:text-[28px] md:text-[36px] font-bold tracking-tight text-gray-900">
              От заявки до объекта — 4 шага
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {STEPS.map((step, i) => (
              <div key={i} className="relative flex flex-col gap-4 p-6 sm:p-7 bg-white border border-gray-200 rounded-2xl">
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-full w-4 border-t-2 border-dashed border-gray-200 z-10" />
                )}
                <span className="text-[13px] font-bold text-brand-primary">{step.n}</span>
                <h3 className="text-[15px] font-bold text-gray-900 leading-snug">{step.title}</h3>
                <p className="text-[13px] text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <button
              onClick={openModal}
              className="inline-flex items-center gap-2 bg-brand-primary hover:bg-brand-primary/90 active:scale-[0.98] text-white font-semibold text-[14px] px-7 py-3.5 rounded-full shadow-md hover:shadow-lg transition-all"
            >
              <PhoneCallIcon /> Получить расчёт
            </button>
            <a
              href={`https://${CONTACTS.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#22c05c] active:scale-[0.98] text-white font-semibold text-[14px] px-7 py-3.5 rounded-full shadow-md hover:shadow-lg transition-all"
            >
              <WhatsAppIcon /> {CONTACTS.whatsappPhone}
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════ DARK CTA ═══════════ */}
      <section className="py-6 sm:py-8 pb-24">
        <div className="container">
          <div className="relative overflow-hidden bg-[#0d1117] rounded-2xl sm:rounded-3xl lg:rounded-[40px] p-6 sm:p-10 lg:p-14 xl:p-16 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-10">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4" />
              <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-brand-primary/10 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/4" />
            </div>

            <div className="flex flex-col gap-4 max-w-2xl z-10 text-center lg:text-left">
              <h2 className="text-[22px] sm:text-[32px] md:text-[38px] lg:text-[44px] font-bold tracking-tight text-white leading-tight">
                Нужен расчёт под ваш проект?
              </h2>
              <p className="text-[13px] sm:text-[15px] md:text-[16px] text-gray-400 leading-relaxed">
                Оставьте заявку — отдел продаж рассчитает точный объём и стоимость за 30 минут. Работаем с предприятиями КР.
              </p>
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start text-[13px] text-gray-600 font-medium">
                <span className="flex items-center gap-1.5"><span className="text-green-400"><CheckIcon /></span> Расчёт КП</span>
                <span className="flex items-center gap-1.5"><span className="text-green-400"><CheckIcon /></span> Ответ за 30 минут</span>
                <span className="flex items-center gap-1.5"><span className="text-green-400"><CheckIcon /></span> Скидки от объёма</span>
              </div>
            </div>

            <div className="z-10 flex flex-col items-center lg:items-end gap-3 shrink-0 w-full lg:w-auto">
              <button
                onClick={openModal}
                className="w-full lg:w-auto inline-flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-primary/90 active:scale-[0.98] text-white font-semibold text-[15px] px-8 py-4 rounded-full shadow-xl shadow-brand-primary/25 hover:shadow-brand-primary/40 transition-all"
              >
                Получить коммерческое предложение <ArrowRight />
              </button>
              <a
                href={`https://${CONTACTS.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full lg:w-auto inline-flex items-center justify-center gap-2 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#4ade80] font-semibold text-[14px] px-8 py-3.5 rounded-full border border-[#25D366]/20 transition-all"
              >
                <WhatsAppIcon /> Написать в WhatsApp
              </a>
              <span className="text-[12px] text-gray-600">
                {CONTACTS.address}
              </span>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
