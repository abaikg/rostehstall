import type { Metadata } from "next";
import Link from "next/link";
import { products, CATEGORY_LIST } from "@/data/catalog";
import { JsonLd } from "@/components/seo/JsonLd";
import { PriceActions, PriceRowCta } from "@/components/features/price/PriceActions";
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
    <div className="flex flex-col pb-24">
      <JsonLd id="price-jsonld" data={jsonLd} />

      {/* ── Шапка ── */}
      <div className="pt-8 sm:pt-12 pb-8 border-b border-gray-100">
        <div className="container flex flex-col gap-5">
          <nav className="flex items-center gap-1.5 text-[12px] font-semibold text-gray-400">
            <Link href="/" className="hover:text-gray-700 transition-colors">Главная</Link>
            <span aria-hidden>›</span>
            <span className="text-gray-700">Прайс-лист</span>
          </nav>
          <div className="flex flex-col gap-3 max-w-3xl">
            <h1 className="text-[24px] sm:text-[32px] md:text-[42px] font-bold tracking-tight text-gray-900">
              Цены на металлопрокат в Бишкеке
            </h1>
            <p className="text-[14px] sm:text-[16px] text-gray-500 leading-relaxed">
              Прайс-лист Ростехсталь: арматура, трубы, лист, швеллер и уголок со склада в Бишкеке.
              Рынок металла меняется еженедельно, поэтому актуальную цену под ваш объём присылаем
              в WhatsApp за 5 минут — с честным весом, резкой под размер и доставкой по всему Кыргызстану.
            </p>
          </div>
          <PriceActions />
        </div>
      </div>

      {/* ── Таблицы по категориям ── */}
      <div className="container pt-8 sm:pt-10 flex flex-col gap-10">
        {grouped.map((group) => (
          <section key={group.category} className="flex flex-col gap-4">
            <h2 className="text-[20px] sm:text-[24px] font-bold tracking-tight text-gray-900">
              {group.category}
            </h2>
            <div className="overflow-x-auto rounded-2xl border border-gray-200">
              <table className="w-full min-w-[480px] text-left">
                <thead>
                  <tr className="bg-gray-50 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                    <th className="px-4 py-3 sm:px-5">Наименование</th>
                    <th className="px-4 py-3 sm:px-5 w-[240px]">Цена</th>
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
          </section>
        ))}

        {/* ── FAQ ── */}
        <section className="border-t border-gray-100 pt-10">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-bold uppercase tracking-widest text-brand-primary">Вопросы о ценах</span>
              <h2 className="text-[22px] sm:text-[28px] font-bold tracking-tight text-gray-900">Частые вопросы</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {PRICE_FAQ.map((faq) => (
                <div key={faq.question} className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col gap-2">
                  <h3 className="text-[14px] font-bold text-gray-900 leading-snug">{faq.question}</h3>
                  <p className="text-[13px] text-gray-500 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-2.5">
              <Link
                href="/calculator"
                className="inline-flex items-center justify-center bg-white text-gray-700 font-semibold text-[13px] px-5 py-2.5 rounded-full border border-gray-200 hover:bg-gray-50 transition-all"
              >
                Рассчитать вес металла
              </Link>
              <Link
                href="/catalog"
                className="inline-flex items-center justify-center bg-brand-primary hover:bg-brand-primary/90 text-white font-semibold text-[13px] px-5 py-2.5 rounded-full shadow-sm transition-all"
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
