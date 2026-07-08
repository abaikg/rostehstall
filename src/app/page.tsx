"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { products, Product } from "@/data/catalog";
import { ProductCard } from "@/components/features/catalog/ProductCard";
import { useOrderModal } from "@/context/ModalContext";
import { CONTACTS } from "@/lib/constants";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqPageJsonLd, jsonLdGraph } from "@/lib/seo";
import { getCategoryPath } from "@/lib/catalogRoutes";
import { trackLead } from "@/lib/analytics";

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
const WhatsAppIconSmall = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
  </svg>
);

interface HomeCategory {
  name: string;
  categoryName: string; // точное имя из CATEGORY_LIST — для ссылки на страницу категории
  photo: string;        // локальное фото-заглушка (реальных фото на каждую категорию пока нет)
  span?: string;        // доп. классы grid-span для мозаики на lg+
}

/* ── Категории для быстрого перехода — мозаика с фото вместо иконок.
   Уникальных фото на каждую категорию нет, поэтому переиспользуем 10 имеющихся
   снимков по смыслу (одна товарная группа — один снимок), это не вводит в
   заблуждение, т.к. категории и правда relatedные (см. CATEGORY_LIST). ── */
const HOME_CATEGORIES: HomeCategory[] = [
  { name: "Арматура", categoryName: "Сортовой прокат", photo: "/images/rebar.png", span: "lg:col-span-2 lg:row-span-2" },
  { name: "Листовой металл", categoryName: "Листовой прокат", photo: "/images/steel-sheet.png", span: "lg:col-span-2" },
  { name: "Трубы", categoryName: "Трубный прокат", photo: "/images/seamless-pipes.png", span: "lg:col-span-2" },
  { name: "Катанка", categoryName: "Сортовой прокат", photo: "/images/hero/hero-warehouse-rebar.jpg" },
  { name: "Круг", categoryName: "Сортовой прокат", photo: "/images/profile-pipes.png" },
  { name: "Угол", categoryName: "Фасонный прокат", photo: "/images/products/structural-profiles.png" },
  { name: "Швеллер", categoryName: "Фасонный прокат", photo: "/images/products/structural-profiles.png" },
  { name: "Электроды", categoryName: "Сварочные материалы", photo: "/images/hero/hero-clean-stock.jpg" },
  { name: "Сетка МАК", categoryName: "Металлические сетки", photo: "/images/products/aluminum-profiles.png" },
  { name: "Гвозди", categoryName: "Метизы", photo: "/images/rebar.png" },
  { name: "Задвижки и фланцы", categoryName: "Трубопроводная арматура", photo: "/images/products/cement-pipes.png" },
  { name: "Проволока", categoryName: "Провода и кабельная продукция", photo: "/images/hero/hero-metal-yard.jpg" },
  { name: "Двутавр", categoryName: "Фасонный прокат", photo: "/images/products/structural-profiles.png" },
  { name: "Гайки, болты, шайбы", categoryName: "Крепежные элементы", photo: "/images/products/aluminum-profiles.png" },
];

/* ── FAQ главной: живой блок + FAQPage-разметка для сниппетов в поиске ── */
const HOME_FAQ = [
  {
    question: "Где купить металлопрокат в Бишкеке с доставкой?",
    answer:
      "Ростехсталь — металлобаза в Бишкеке с 1000+ позициями на складе: арматура, профильная и круглая труба, лист, швеллер, уголок, балка. Доставляем по Бишкеку и всем регионам Кыргызстана собственным транспортом, отгрузка в день оплаты.",
  },
  {
    question: "Сколько стоит арматура и профильная труба?",
    answer:
      "Актуальные цены со склада публикуем на странице «Прайс». Цена зависит от объёма: от 1 тонны действуют скидки, для строительных компаний — индивидуальные условия. Финальную цену менеджер фиксирует в коммерческом предложении за 30 минут.",
  },
  {
    question: "Есть ли резка металла под размер?",
    answer:
      "Да, режем металлопрокат под ваши проектные размеры: трубы, арматуру, лист, сортовой прокат. Это экономит транспорт и время на объекте — привозим готовые к монтажу отрезки.",
  },
  {
    question: "Металл сертифицирован?",
    answer:
      "Весь металлопрокат поставляется напрямую с заводов РФ и Казахстана с паспортами качества и сертификатами ГОСТ. Для сейсмоопасного региона это критично: несём ответственность за каждую партию.",
  },
  {
    question: "Как быстро посчитать вес и стоимость металла?",
    answer:
      "Воспользуйтесь онлайн-калькулятором металла на сайте: выбираете прокат, размеры или номер по ГОСТ — получаете точный вес. Одним кликом из расчёта отправляется заявка, и менеджер отвечает с ценой.",
  },
  {
    question: "Работаете с юридическими лицами и по безналу?",
    answer:
      "Да, работаем с ОсОО, ИП и госорганизациями: безналичный расчёт, ЭСФ, договор поставки, отсрочка для постоянных клиентов. Бухгалтерские документы выдаём сразу при отгрузке.",
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

/* ── Страница ── */
export default function HomePage() {
  const { openModal } = useOrderModal();
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
      <JsonLd id="home-faq-jsonld" data={jsonLdGraph([faqPageJsonLd(HOME_FAQ)])} />

      {/* ═══════════ HERO ═══════════ */}
      <section className="relative isolate flex min-h-[620px] sm:min-h-[720px] lg:min-h-[820px] items-center overflow-hidden py-24 sm:py-32 lg:py-40">
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
          <div className="absolute inset-0 backdrop-blur-[0.5px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/72 via-blue-50/46 to-white/76" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_65%_at_50%_12%,rgba(191,219,254,0.34),rgba(239,246,255,0.22)_42%,transparent_72%)]" />
          <div className="absolute left-1/2 top-6 h-56 w-[min(760px,92vw)] -translate-x-1/2 rounded-full bg-blue-400/10 blur-2xl" />
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
          <div className="flex max-w-[1280px] translate-y-4 flex-col items-start gap-6 text-left sm:translate-y-8 lg:translate-y-12">

            <span
              className="text-[12px] sm:text-[14px] font-bold uppercase tracking-normal text-gray-900"
              style={{ textShadow: "0 2px 14px rgba(255,255,255,0.95), 0 1px 2px rgba(255,255,255,0.9)" }}
            >
              ПОСТАВКИ МЕТАЛЛОПРОКАТА В КЫРГЫЗСТАНЕ
            </span>
            <h1
              className="text-[28px] xs:text-[32px] sm:text-[42px] md:text-[46px] lg:text-[48px] xl:text-[54px] 2xl:text-[64px] font-bold tracking-normal text-gray-950 leading-[1.1] sm:leading-[1.05]"
              style={{ textShadow: "0 3px 18px rgba(255,255,255,0.96), 0 1px 2px rgba(255,255,255,0.92)" }}
            >
              <span className="block xl:whitespace-nowrap">КРУПНЕЙШАЯ МЕТАЛЛОБАЗА</span>
              <span className="block text-brand-primary xl:whitespace-nowrap">
                ПО МЕТАЛЛОПРОКАТУ В КЫРГЫЗСТАНЕ
              </span>
            </h1>

            <p
              className="max-w-2xl text-[14px] sm:text-[16px] md:text-[18px] text-gray-800 leading-relaxed font-bold"
              style={{ textShadow: "0 2px 12px rgba(255,255,255,0.95), 0 1px 2px rgba(255,255,255,0.9)" }}
            >
              <span className="block">Стальные листы, трубы, профили, арматура и спецсталь —</span>
              <span className="block">широкий ассортимент металлопродукции высокого качества для строительных и промышленных предприятий.</span>
            </p>

            {/* CTA кнопки */}
            <div className="flex flex-col sm:flex-row flex-wrap justify-start gap-3 mt-2 w-full sm:w-auto">
              <Link
                href="/catalog"
                className="inline-flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-primary/90 active:scale-[0.98] text-white font-semibold text-[14px] sm:text-[15px] px-6 sm:px-7 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
              >
                Перейти в каталог <ArrowRight />
              </Link>
              <a
                href={`https://${CONTACTS.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#22c05c] active:scale-[0.98] text-white font-semibold text-[14px] sm:text-[15px] px-6 sm:px-7 py-3.5 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
              >
                <WhatsAppIcon /> Написать в WhatsApp
              </a>
              <Link
                href="/calculator"
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 active:scale-[0.98] text-gray-800 font-semibold text-[14px] sm:text-[15px] px-6 sm:px-7 py-3.5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200"
              >
                Калькулятор
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* ═══════════ КАТЕГОРИИ ═══════════ */}
      <section className="py-14 sm:py-20">
        <div className="container flex flex-col gap-6 sm:gap-8">
          <div className="flex max-w-xl flex-col items-start gap-2 text-left">
            <h2 className="text-[22px] sm:text-[28px] md:text-[36px] font-bold uppercase tracking-normal text-gray-900 leading-tight">
              СВЯЖИТЕСЬ С МЕНЕДЖЕРОМ НАПРЯМУЮ
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 lg:auto-rows-[140px] lg:grid-flow-dense gap-3 sm:gap-4">
            {HOME_CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                href={getCategoryPath(cat.categoryName)}
                className={`group relative aspect-square lg:aspect-auto flex flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl p-4 text-center shadow-sm transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg ${cat.span ?? ""}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cat.photo}
                  alt={`${cat.name} в Бишкеке — Ростехсталь`}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0a1730]/92 via-[#12244d]/55 to-[#12244d]/10" />

                <span className="relative z-10 px-1 text-[13px] sm:text-[14px] font-bold uppercase leading-snug text-white drop-shadow-sm">
                  {cat.name}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    trackLead("whatsapp");
                    window.open(
                      `https://${CONTACTS.whatsapp}?text=${encodeURIComponent(`Здравствуйте! Интересует: ${cat.name}. Подскажите цену и наличие.`)}`,
                      "_blank",
                      "noopener,noreferrer"
                    );
                  }}
                  aria-label={`Написать в WhatsApp: ${cat.name}`}
                  className="group/wa relative z-10 mt-1 inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-white px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-tight text-gray-900 shadow-sm transition-colors hover:bg-green-500 hover:text-white"
                >
                  <span className="text-green-600 transition-colors group-hover/wa:text-white"><WhatsAppIconSmall /></span>
                  Написать WhatsApp
                </button>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ ПРОДУКТЫ ═══════════ */}
      <section className="py-20 sm:py-24 bg-gray-50/50">
        <div className="container flex flex-col gap-10">

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pb-6 border-b border-gray-200">
            <div className="flex flex-col gap-2">
              <h2 className="text-[22px] sm:text-[28px] md:text-[36px] font-bold uppercase tracking-normal text-gray-900">
                СВЯЖИТЕСЬ С МЕНЕДЖЕРОМ НАПРЯМУЮ
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {popularProducts.map((product) => (
              <ProductCard key={product.id} product={product} hideSize hideMeta />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ КАК МЫ РАБОТАЕМ ═══════════ */}
      <section className="py-14 sm:py-24">
        <div className="container flex flex-col gap-7 sm:gap-10">

          <div className="flex max-w-lg flex-col items-start gap-2 text-left">
            <span className="text-[11px] sm:text-[12px] font-bold uppercase tracking-normal text-brand-primary">Как мы работаем</span>
            <h2 className="text-[24px] sm:text-[28px] md:text-[36px] font-bold uppercase tracking-normal text-gray-900 leading-tight">
              От заявки до объекта — 4 шага
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {STEPS.map((step, i) => (
              <div key={i} className="relative flex flex-row items-start gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm shadow-gray-200/40 sm:flex-col sm:gap-4 sm:p-7 sm:shadow-none">
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-full w-4 border-t-2 border-dashed border-gray-200 z-10" />
                )}
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[13px] font-bold text-brand-primary sm:h-auto sm:w-auto sm:bg-transparent">
                  {step.n}
                </span>
                <div className="flex min-w-0 flex-col gap-1.5 sm:gap-4">
                  <h3 className="text-[15px] font-bold text-gray-950 leading-snug">{step.title}</h3>
                  <p className="text-[13px] text-gray-600 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 pt-1 sm:pt-2">
            <button
              onClick={openModal}
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 bg-brand-primary hover:bg-brand-primary/90 active:scale-[0.98] text-white font-bold text-[13px] sm:text-[14px] px-7 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              <PhoneCallIcon /> Получить расчёт
            </button>
            <a
              href={`https://${CONTACTS.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 bg-[#25D366] hover:bg-[#22c05c] active:scale-[0.98] text-white font-bold text-[13px] sm:text-[14px] px-7 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              <WhatsAppIcon /> {CONTACTS.whatsappPhone}
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════ FAQ (SEO: FAQPage schema) ═══════════ */}
      <section className="py-12 sm:py-20 border-t border-gray-100">
        <div className="container flex flex-col gap-6 sm:gap-8">
          <div className="flex max-w-2xl flex-col items-start gap-2 text-left">
            <span className="text-[11px] sm:text-[12px] font-bold uppercase tracking-normal text-brand-primary">Частые вопросы</span>
            <h2 className="text-[24px] sm:text-[28px] md:text-[34px] font-bold uppercase tracking-normal text-gray-900 leading-tight">
              Вопросы о покупке металлопроката в Бишкеке
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {HOME_FAQ.map((faq) => (
              <div key={faq.question} className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 flex flex-col gap-2.5 shadow-sm shadow-gray-200/40 sm:shadow-none">
                <h3 className="text-[15px] sm:text-[16px] font-bold text-gray-950 leading-snug">{faq.question}</h3>
                <p className="text-[13px] sm:text-[14px] text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ DARK CTA ═══════════ */}
      <section className="py-6 sm:py-8 pb-24">
        <div className="container">
          <div className="relative overflow-hidden bg-[#0d1117] rounded-xl sm:rounded-xl lg:rounded-xl p-5 sm:p-10 lg:p-14 xl:p-16 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-7 lg:gap-10">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4" />
              <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-brand-primary/10 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/4" />
            </div>

            <div className="flex flex-col gap-4 max-w-2xl z-10 text-left">
              <h2 className="text-[24px] sm:text-[32px] md:text-[38px] lg:text-[44px] font-bold uppercase tracking-normal text-white leading-tight">
                Нужен расчёт под ваш проект?
              </h2>
              <p className="text-[13px] sm:text-[15px] md:text-[16px] text-gray-300 leading-relaxed">
                Оставьте заявку — отдел продаж рассчитает точный объём и стоимость за 30 минут. Работаем с предприятиями КР.
              </p>
              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 text-[13px] text-gray-200 font-semibold">
                <span className="inline-flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 border border-white/10"><span className="text-green-400"><CheckIcon /></span> Расчёт КП</span>
                <span className="inline-flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 border border-white/10"><span className="text-green-400"><CheckIcon /></span> Ответ за 30 минут</span>
                <span className="inline-flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 border border-white/10"><span className="text-green-400"><CheckIcon /></span> Скидки от объёма</span>
              </div>
            </div>

            <div className="z-10 flex flex-col items-stretch lg:items-end gap-3 shrink-0 w-full lg:w-auto">
              <button
                onClick={openModal}
                className="w-full lg:w-auto inline-flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-primary/90 active:scale-[0.98] text-white font-bold text-[13px] sm:text-[15px] uppercase tracking-normal px-6 sm:px-8 py-4 rounded-xl shadow-xl shadow-brand-primary/25 hover:shadow-brand-primary/40 transition-all"
              >
                Получить коммерческое предложение <ArrowRight />
              </button>
              <a
                href={`https://${CONTACTS.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full lg:w-auto inline-flex items-center justify-center gap-2 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#4ade80] font-bold text-[13px] sm:text-[14px] uppercase tracking-normal px-6 sm:px-8 py-3.5 rounded-xl border border-[#25D366]/20 transition-all"
              >
                <WhatsAppIcon /> Написать в WhatsApp
              </a>
              <span className="text-left lg:text-right text-[12px] text-gray-400 leading-relaxed">
                {CONTACTS.address}
              </span>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
