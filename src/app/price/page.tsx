import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { PriceRowCta } from "@/components/features/price/PriceActions";
import type { Product } from "@/data/catalog";
import { CONTACTS } from "@/lib/constants";
import { getProducts } from "@/lib/db";
import { getCategoryPath, getPublicProductGroup, slugifySegment } from "@/lib/catalogRoutes";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  buildMetadata,
  faqPageJsonLd,
  jsonLdGraph,
} from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Прайс-лист на металлопрокат в Бишкеке - Ростехсталь",
  description:
    "Прайс-лист на металлопрокат в Бишкеке: арматура, профильная труба, лист, швеллер, уголок со склада. Актуальную цену пришлем в WhatsApp за 5 минут - резка и доставка по Кыргызстану.",
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
      "Рынок металла подвижен: заводские цены и курс меняются еженедельно, а финальная цена зависит от объема. Чтобы не вводить в заблуждение устаревшими цифрами, мы присылаем актуальный прайс в WhatsApp за 5 минут и фиксируем цену в счете.",
  },
  {
    question: "Есть ли скидки от объема?",
    answer:
      "Да, при заказе от 1 тонны действует гибкая система скидок. Для строительных компаний и постоянных клиентов - индивидуальные условия и отсрочка по договору.",
  },
  {
    question: "Цена будет с доставкой?",
    answer:
      "Менеджер считает цену со склада в Бишкеке, а доставку по городу и регионам Кыргызстана - отдельно по тоннажу и маршруту. Обе суммы вы увидите сразу в коммерческом предложении.",
  },
];

const priceWhatsAppLink = `https://${CONTACTS.whatsapp}?text=${encodeURIComponent(
  "Здравствуйте! Напишите, пожалуйста, актуальную цену на металлопрокат."
)}`;

function getPriceGroups() {
  const groups = new Map<string, Product[]>();

  for (const product of getProducts()) {
    const groupName = getPublicProductGroup(product);
    const items = groups.get(groupName) ?? [];
    items.push(product);
    groups.set(groupName, items);
  }

  return Array.from(groups.entries()).map(([category, items]) => ({
    category,
    id: slugifySegment(category),
    path: getCategoryPath(category),
    items,
  }));
}

function getSpecBadges(product: Product) {
  return [
    product.gost ? { label: "ГОСТ", value: product.gost } : null,
    product.steelGrade ? { label: "Марка", value: product.steelGrade } : null,
    product.size ? { label: "Размер", value: product.size } : null,
    product.thickness ? { label: "Толщина", value: product.thickness } : null,
    product.weightMeter ? { label: "Вес 1 м", value: `${product.weightMeter} кг` } : null,
    product.weightSquareMeter ? { label: "Вес 1 м2", value: `${product.weightSquareMeter} кг` } : null,
    product.weightItem ? { label: "Вес шт.", value: `${product.weightItem} кг` } : null,
  ].filter(Boolean) as Array<{ label: string; value: string }>;
}

export default function PricePage() {
  const grouped = getPriceGroups();
  const productCount = grouped.reduce((sum, group) => sum + group.items.length, 0);

  const jsonLd = jsonLdGraph([
    breadcrumbJsonLd([
      { name: "Главная", path: "/" },
      { name: "Прайс-лист", path: "/price" },
    ]),
    faqPageJsonLd(PRICE_FAQ),
    {
      "@type": "CollectionPage",
      "@id": `${absoluteUrl("/price")}#pricelist`,
      name: "Прайс-лист на металлопрокат - Ростехсталь, Бишкек",
      url: absoluteUrl("/price"),
      mainEntity: {
        "@type": "ItemList",
        itemListElement: grouped.flatMap((group, groupIndex) =>
          group.items.map((product, index) => ({
            "@type": "ListItem",
            position: groupIndex * 1000 + index + 1,
            name: product.name,
            url: absoluteUrl(`/catalog/${product.slug}`),
          }))
        ),
      },
    },
  ]);

  return (
    <div className="flex flex-col bg-white pb-16 sm:pb-24">
      <JsonLd id="price-jsonld" data={jsonLd} />

      <section className="border-b border-gray-100 bg-gradient-to-b from-blue-50/70 via-white to-white py-5 sm:py-10">
        <div className="container">
          <div className="grid gap-4 lg:grid-cols-[1fr_360px] lg:items-end">
            <div className="flex flex-col gap-3">
              <span className="text-[11px] font-bold uppercase tracking-normal text-brand-primary">
                Прайс-лист
              </span>
              <h1 className="max-w-4xl text-[30px] font-bold uppercase leading-[1.06] tracking-normal text-gray-950 sm:text-[46px]">
                Актуальные цены на металлопрокат
              </h1>
              <p className="max-w-2xl text-[14px] leading-relaxed text-gray-600 sm:text-[16px]">
                Выберите позицию и напишите менеджеру. Проверим наличие, посчитаем объем, резку и доставку по Бишкеку и регионам.
              </p>
              <div className="grid grid-cols-2 gap-2 pt-1 sm:flex sm:flex-wrap">
                <span className="rounded-lg border border-blue-100 bg-white px-3 py-2 text-[12px] font-bold text-gray-700 shadow-sm shadow-blue-100/40">
                  {grouped.length} разделов
                </span>
                <span className="rounded-lg border border-blue-100 bg-white px-3 py-2 text-[12px] font-bold text-gray-700 shadow-sm shadow-blue-100/40">
                  {productCount} позиций
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-lg shadow-gray-200/60">
              <p className="text-[12px] font-bold uppercase tracking-normal text-gray-400">Отдел продаж</p>
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
      </section>

      <div className="container flex flex-col gap-7 pt-5 sm:gap-10 sm:pt-10">
        <nav className="sticky top-[64px] z-20 -mx-4 overflow-x-auto border-y border-gray-100 bg-white/95 px-4 py-3 backdrop-blur sm:static sm:mx-0 sm:rounded-xl sm:border sm:px-3">
          <div className="flex w-max gap-2 sm:w-auto sm:flex-wrap">
            {grouped.map((group) => (
              <a
                key={group.category}
                href={`#${group.id}`}
                className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-[12px] font-bold text-gray-700 transition-colors hover:border-brand-primary/40 hover:text-brand-primary"
              >
                <span>{group.category}</span>
                <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-500">{group.items.length}</span>
              </a>
            ))}
          </div>
        </nav>

        {grouped.map((group) => (
          <section key={group.category} id={group.id} className="scroll-mt-32">
            <div className="mb-3 flex items-end justify-between gap-4 border-b border-gray-200 pb-3">
              <div>
                <h2 className="text-[22px] font-bold uppercase leading-tight tracking-normal text-gray-950 sm:text-[28px]">
                  {group.category}
                </h2>
                <Link href={group.path} className="mt-1 inline-flex text-[12px] font-bold text-brand-primary">
                  Открыть в каталоге
                </Link>
              </div>
              <span className="shrink-0 text-[12px] font-bold text-gray-400">{group.items.length} поз.</span>
            </div>

            <div className="hidden overflow-hidden rounded-xl border border-gray-200 bg-white md:block">
              <table className="w-full min-w-[560px] text-left">
                <thead>
                  <tr className="bg-gray-50 text-[11px] font-bold uppercase tracking-normal text-gray-500">
                    <th className="px-5 py-3">Наименование</th>
                    <th className="px-5 py-3">Характеристики</th>
                    <th className="w-[300px] px-5 py-3 text-right">Действие</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {group.items.map((product) => {
                    const specs = getSpecBadges(product).slice(0, 3);

                    return (
                      <tr key={product.id} className="bg-white transition-colors hover:bg-blue-50/40">
                        <td className="px-5 py-3">
                          <Link
                            href={`/catalog/${product.slug}`}
                            className="text-[14px] font-semibold text-gray-900 transition-colors hover:text-brand-primary"
                          >
                            {product.name}
                          </Link>
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex flex-wrap gap-1.5">
                            {specs.length > 0 ? (
                              specs.map((spec) => (
                                <span key={`${product.id}-${spec.label}`} className="rounded bg-gray-50 px-2 py-1 text-[11px] font-semibold text-gray-600">
                                  {spec.label}: {spec.value}
                                </span>
                              ))
                            ) : (
                              <span className="text-[12px] text-gray-400">По запросу</span>
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-3 text-right">
                          <PriceRowCta productName={product.name} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="grid gap-2 md:hidden">
              {group.items.map((product) => {
                const specs = getSpecBadges(product).slice(0, 4);

                return (
                  <article key={product.id} className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm shadow-gray-200/50">
                    <div className="flex items-start justify-between gap-3">
                      <Link href={`/catalog/${product.slug}`} className="min-w-0 flex-1 text-[15px] font-bold leading-snug text-gray-950">
                        {product.name}
                      </Link>
                      <span className="shrink-0 rounded bg-blue-50 px-2 py-1 text-[10px] font-bold uppercase text-brand-primary">
                        Цена
                      </span>
                    </div>
                    {specs.length > 0 && (
                      <dl className="mt-3 grid grid-cols-2 gap-2">
                        {specs.map((spec) => (
                          <div key={`${product.id}-${spec.label}`} className="rounded bg-gray-50 px-2.5 py-2">
                            <dt className="text-[10px] font-bold uppercase text-gray-400">{spec.label}</dt>
                            <dd className="mt-0.5 break-words text-[12px] font-semibold leading-tight text-gray-800">{spec.value}</dd>
                          </div>
                        ))}
                      </dl>
                    )}
                    <div className="mt-3 border-t border-gray-100 pt-3">
                      <PriceRowCta productName={product.name} />
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        ))}

        <details className="group border-y border-gray-200 py-4 sm:rounded-xl sm:border sm:px-5">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[13px] font-bold uppercase text-gray-700 marker:content-none">
            <span>Разделы каталога</span>
            <span
              aria-hidden="true"
              className="text-[20px] font-medium leading-none text-brand-primary transition-transform group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <nav aria-label="Разделы каталога металлопроката" className="mt-4 grid grid-cols-1 gap-x-6 gap-y-2 border-t border-gray-100 pt-4 sm:grid-cols-2 lg:grid-cols-3">
            {grouped.map((group) => (
              <Link
                key={`seo-${group.category}`}
                href={group.path}
                prefetch={false}
                className="flex items-center justify-between gap-3 py-1 text-[13px] font-semibold text-gray-600 transition-colors hover:text-brand-primary"
              >
                <span>{group.category}</span>
                <span className="shrink-0 text-[11px] text-gray-400">{group.items.length}</span>
              </Link>
            ))}
          </nav>
        </details>

        <section className="border-t border-gray-100 pt-8 sm:pt-10">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-bold uppercase tracking-normal text-brand-primary sm:text-[12px]">
                Вопросы о ценах
              </span>
              <h2 className="text-[24px] font-bold uppercase tracking-normal text-gray-950 sm:text-[30px]">
                Частые вопросы
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-3">
              {PRICE_FAQ.map((faq) => (
                <div key={faq.question} className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-4 shadow-sm shadow-gray-200/40 sm:p-5 sm:shadow-none">
                  <h3 className="text-[15px] font-bold leading-snug text-gray-950">{faq.question}</h3>
                  <p className="text-[13px] leading-relaxed text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
              <Link
                href="/calculator"
                className="inline-flex w-full items-center justify-center rounded-xl border border-gray-200 bg-white px-5 py-3 text-[13px] font-bold text-gray-700 transition-all hover:bg-gray-50 sm:w-auto"
              >
                Рассчитать вес металла
              </Link>
              <Link
                href="/catalog"
                className="inline-flex w-full items-center justify-center rounded-xl bg-brand-primary px-5 py-3 text-[13px] font-bold text-white shadow-sm transition-all hover:bg-brand-primary/90 sm:w-auto"
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
