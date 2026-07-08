import type { Metadata } from "next";
import Link from "next/link";
import { products, CATEGORY_LIST } from "@/data/catalog";
import { JsonLd } from "@/components/seo/JsonLd";
import { PriceRowCta } from "@/components/features/price/PriceActions";
import { CONTACTS } from "@/lib/constants";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  buildMetadata,
  faqPageJsonLd,
  jsonLdGraph,
} from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Прайс-лист на металлопрокат в Бишкеке — Ростехсталь",
  description:
    "Прайс-лист на металлопрокат в Бишкеке: арматура, профильная труба, лист, швеллер, уголок со склада. Актуальную цену пришлём в WhatsApp за 5 минут — резка и доставка по Кыргызстану.",
  path: "/price",
  keywords: [
    "прайс металлопрокат Бишкек",
    "цены на металлопрокат Бишкек",
    "цена арматуры Бишкек",
    "стоимость профильной трубы Бишкек",
    "прайс-лист металлобаза",
  ],
});

const PRICE_FAQ = [
  {
    question: "Почему цены не указаны на сайте?",
    answer:
      "Рынок металла подвижен: заводские цены и курс меняются еженедельно, а финальная цена зависит от объёма. Чтобы не вводить в заблуждение устаревшими цифрами, мы присылаем актуальный прайс в WhatsApp за 5 минут и фиксируем цену в счёте.",
  },
  {
    question: "Есть ли скидки от объёма?",
    answer:
      "Да, при заказе от 1 тонны действует гибкая система скидок. Для строительных компаний и постоянных клиентов — индивидуальные условия и отсрочка по договору.",
  },
  {
    question: "Цена будет с доставкой?",
    answer:
      "Менеджер считает цену со склада в Бишкеке, а доставку по городу и регионам Кыргызстана — отдельно по тоннажу и маршруту. Обе суммы вы увидите сразу в коммерческом предложении.",
  },
];

const priceWhatsAppLink = `https://${CONTACTS.whatsapp}?text=${encodeURIComponent(
  "Здравствуйте! Напишите, пожалуйста, актуальную цену на металлопрокат."
)}`;

export default function PricePage() {
  const grouped = CATEGORY_LIST
    .map(({ name }) => ({
      category: name,
      items: products.filter((product) => product.category === name),
    }))
    .filter((group) => group.items.length > 0);

  const jsonLd = jsonLdGraph([
    breadcrumbJsonLd([
      { name: "Главная", path: "/" },
      { name: "Прайс-лист", path: "/price" },
    ]),
    faqPageJsonLd(PRICE_FAQ),
    {
      "@type": "CollectionPage",
      "@id": `${absoluteUrl("/price")}#pricelist`,
      name: "Прайс-лист на металлопрокат — Ростехсталь, Бишкек",
      url: absoluteUrl("/price"),
      mainEntity: {
        "@type": "ItemList",
        itemListElement: grouped.flatMap((group, groupIndex) =>
          group.items.map((product, index) => ({
            "@type": "ListItem",
            position: groupIndex * 100 + index + 1,
            name: product.name,
            url: absoluteUrl(`/catalog/${product.slug}`),
          }))
        ),
      },
    },
  ]);

  return (
    <div className="flex flex-col pb-20 sm:pb-24">
      <JsonLd id="price-jsonld" data={jsonLd} />

      {/* ── Шапка ── */}
      <div className="relative overflow-hidden border-b border-gray-100 bg-gradient-to-b from-blue-50/80 via-white to-white pt-6 pb-8 sm:pt-10 sm:pb-12">
        <div className="pointer-events-none absolute right-[-120px] top-[-160px] h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="container relative flex flex-col gap-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_360px] lg:items-end">
            <div className="flex max-w-4xl flex-col gap-4">
              <h1 className="whitespace-nowrap text-[clamp(20px,6vw,54px)] font-bold uppercase tracking-normal text-gray-950 leading-tight">
                Напишите прямо менеджеру
              </h1>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-lg shadow-gray-200/60">
              <p className="text-[13px] font-bold uppercase tracking-normal text-gray-400">Отдел продаж</p>
              <a href={`tel:${CONTACTS.phoneRaw}`} className="mt-1 block text-[22px] font-bold text-gray-950">
                {CONTACTS.phone}
              </a>
              <a
                href={priceWhatsAppLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-[#25D366] px-5 py-3.5 text-[13px] font-bold uppercase tracking-normal text-white shadow-md shadow-green-500/20 transition-colors hover:bg-[#22c05c]"
              >
                Написать в WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── Таблицы по категориям ── */}
      <div className="container pt-8 sm:pt-10 flex flex-col gap-8 sm:gap-10">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {grouped.slice(0, 6).map((group) => (
            <a
              key={group.category}
              href={`#${group.category}`}
              className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-[12px] font-bold text-gray-700 transition-colors hover:border-brand-primary/30 hover:text-brand-primary"
            >
              {group.category}
            </a>
          ))}
        </div>

        {grouped.map((group) => (
          <section key={group.category} id={group.category} className="scroll-mt-24 flex flex-col gap-4">
            <div className="flex items-end justify-between gap-4 border-b border-gray-200 pb-3">
              <h2 className="text-[22px] sm:text-[28px] font-bold uppercase tracking-normal text-gray-950">
              {group.category}
              </h2>
              <span className="shrink-0 text-[12px] font-bold text-gray-400">{group.items.length} поз.</span>
            </div>

            <div className="hidden overflow-hidden rounded-xl border border-gray-200 bg-white md:block">
              <table className="w-full min-w-[480px] text-left">
                <thead>
                  <tr className="bg-gray-50 text-[11px] font-bold uppercase tracking-normal text-gray-500">
                    <th className="px-4 py-3 sm:px-5">Наименование</th>
                    <th className="px-4 py-3 sm:px-5 w-[300px] text-right">Действие</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {group.items.map((product) => (
                    <tr key={product.id} className="bg-white transition-colors hover:bg-blue-50/40">
                      <td className="px-4 py-3 sm:px-5">
                        <Link
                          href={`/catalog/${product.slug}`}
                          className="text-[13px] sm:text-[14px] font-semibold text-gray-900 hover:text-brand-primary transition-colors"
                        >
                          {product.name}
                        </Link>
                      </td>
                      <td className="px-4 py-3 sm:px-5 text-right">
                        <PriceRowCta productName={product.name} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid gap-3 md:hidden">
              {group.items.map((product) => (
                <article key={product.id} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm shadow-gray-200/50">
                  <Link href={`/catalog/${product.slug}`} className="block text-[15px] font-bold leading-snug text-gray-950">
                    {product.name}
                  </Link>
                  <div className="mt-3 border-t border-gray-100 pt-3">
                    <PriceRowCta productName={product.name} />
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}

        {/* ── FAQ ── */}
        <section className="border-t border-gray-100 pt-8 sm:pt-10">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <span className="text-[11px] sm:text-[12px] font-bold uppercase tracking-normal text-brand-primary">Вопросы о ценах</span>
              <h2 className="text-[24px] sm:text-[30px] font-bold uppercase tracking-normal text-gray-950">Частые вопросы</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
              {PRICE_FAQ.map((faq) => (
                <div key={faq.question} className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 flex flex-col gap-2 shadow-sm shadow-gray-200/40 sm:shadow-none">
                  <h3 className="text-[15px] font-bold text-gray-950 leading-snug">{faq.question}</h3>
                  <p className="text-[13px] text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row flex-wrap gap-2.5">
              <Link
                href="/calculator"
                className="inline-flex w-full sm:w-auto items-center justify-center bg-white text-gray-700 font-bold text-[13px] px-5 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all"
              >
                Рассчитать вес металла
              </Link>
              <Link
                href="/catalog"
                className="inline-flex w-full sm:w-auto items-center justify-center bg-brand-primary hover:bg-brand-primary/90 text-white font-bold text-[13px] px-5 py-3 rounded-xl shadow-sm transition-all"
              >
                Перейти в каталог
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
