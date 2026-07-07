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
  title: "Прайс-лист на металлопрокат в Бишкеке — цены Ростехсталь",
  description:
    "Актуальные цены на металлопрокат в Бишкеке: арматура, профильная труба, лист, швеллер, уголок. Прайс-лист Ростехсталь со склада, резка и доставка по Кыргызстану.",
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
    question: "Цены в прайсе актуальны?",
    answer:
      "Мы обновляем прайс при изменении заводских цен. Курс и рынок металла подвижны, поэтому перед заказом менеджер подтверждает финальную цену и фиксирует её в счёте.",
  },
  {
    question: "Есть ли скидки от объёма?",
    answer:
      "Да, при заказе от 1 тонны действует гибкая система скидок. Для строительных компаний и постоянных клиентов — индивидуальные условия и отсрочка по договору.",
  },
  {
    question: "Цена указана с доставкой?",
    answer:
      "В прайсе указана цена со склада в Бишкеке. Доставку по городу и регионам Кыргызстана рассчитываем отдельно по тоннажу и маршруту — менеджер назовёт сумму сразу в КП.",
  },
];

export default function PricePage() {
  const grouped = CATEGORY_LIST
    .map(({ name }) => ({
      category: name,
      items: products.filter((product) => product.category === name && product.price),
    }))
    .filter((group) => group.items.length > 0);

  const jsonLd = jsonLdGraph([
    breadcrumbJsonLd([
      { name: "Главная", path: "/" },
      { name: "Прайс-лист", path: "/price" },
    ]),
    faqPageJsonLd(PRICE_FAQ),
    {
      "@type": "OfferCatalog",
      "@id": `${absoluteUrl("/price")}#pricelist`,
      name: "Прайс-лист на металлопрокат — Ростехсталь, Бишкек",
      url: absoluteUrl("/price"),
      itemListElement: grouped.flatMap((group) =>
        group.items.map((product) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Product", name: product.name, url: absoluteUrl(`/catalog/${product.slug}`) },
          price: Number(product.price!.replace(/[^\d]/g, "")),
          priceCurrency: "KGS",
          availability: "https://schema.org/InStock",
        }))
      ),
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
              Актуальный прайс-лист Ростехсталь: арматура, трубы, лист, швеллер и уголок со склада в Бишкеке.
              Цены за тонну, честный вес, резка под размер и доставка по всему Кыргызстану.
              Финальную цену под ваш объём менеджер зафиксирует в коммерческом предложении.
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
              <table className="w-full min-w-[560px] text-left">
                <thead>
                  <tr className="bg-gray-50 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                    <th className="px-4 py-3 sm:px-5">Наименование</th>
                    <th className="px-4 py-3 sm:px-5 w-[150px]">Цена</th>
                    <th className="px-4 py-3 sm:px-5 w-[110px]">Ед.</th>
                    <th className="px-4 py-3 sm:px-5 w-[180px]" />
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
                      <td className="px-4 py-3 sm:px-5 whitespace-nowrap text-[14px] font-bold text-gray-900">
                        {product.price}
                      </td>
                      <td className="px-4 py-3 sm:px-5 whitespace-nowrap text-[12px] font-medium text-gray-500">
                        {product.priceUnit ?? "сом"}
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
