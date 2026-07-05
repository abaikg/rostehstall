import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/features/catalog/ProductCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { getCategoryBySlug, getIndexedCategories, getProductsForCategory } from "@/lib/catalogRoutes";
import { categorySeo } from "@/data/categorySeo";
import {
  breadcrumbJsonLd,
  absoluteUrl,
  buildMetadata,
  categoryMetaDescription,
  faqPageJsonLd,
  jsonLdGraph,
} from "@/lib/seo";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

const ChevronRight = () => (
  <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden>
    <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function getCategoryFaq(category: string) {
  return [
    {
      question: `Как заказать ${category.toLowerCase()} в Ростехсталь?`,
      answer:
        "Выберите позиции в каталоге или отправьте заявку через форму. Менеджер уточнит размер, марку стали, объём и подготовит коммерческое предложение.",
    },
    {
      question: "Можно ли оформить доставку по Кыргызстану?",
      answer:
        "Да, Ростехсталь организует доставку металлопроката по Бишкеку и регионам Кыргызстана с учётом тоннажа и сроков поставки.",
    },
    {
      question: "Выполняется ли резка металла под размер?",
      answer:
        "Для подходящих позиций доступна резка металла под проектные размеры. Уточните параметры у менеджера при оформлении заявки.",
    },
  ];
}

export function generateStaticParams() {
  return getIndexedCategories().map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    return buildMetadata({
      title: "Категория не найдена — Ростехсталь",
      description: "Категория каталога Ростехсталь не найдена. Перейдите в общий каталог металлопроката.",
      path: `/catalog/category/${slug}`,
    });
  }

  return buildMetadata({
    title: `${category.name} в Бишкеке — Ростехсталь`,
    description: categoryMetaDescription(category.name),
    path: category.path,
    keywords: [category.name, `${category.name} Бишкек`, `${category.name} Кыргызстан`],
  });
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) notFound();

  const categoryProducts = getProductsForCategory(category.name);
  const faqs = getCategoryFaq(category.name);
  const seo = categorySeo[category.name];
  const jsonLd = jsonLdGraph([
    breadcrumbJsonLd([
      { name: "Главная", path: "/" },
      { name: "Каталог", path: "/catalog" },
      { name: category.name, path: category.path },
    ]),
    faqPageJsonLd(faqs),
    {
      "@type": "CollectionPage",
      "@id": `${absoluteUrl(category.path)}#category`,
      name: `${category.name} в Бишкеке`,
      description: categoryMetaDescription(category.name),
      mainEntity: {
        "@type": "ItemList",
        itemListElement: categoryProducts.map((product, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: absoluteUrl(`/catalog/${product.slug}`),
          name: product.name,
        })),
      },
    },
  ]);

  return (
    <div className="flex flex-col pb-24">
      <JsonLd id="category-jsonld" data={jsonLd} />

      <div className="pt-8 sm:pt-12 pb-8 border-b border-gray-100">
        <div className="container flex flex-col gap-4">
          <nav className="flex items-center gap-1.5 text-[12px] font-semibold text-gray-400">
            <Link href="/" className="hover:text-gray-700 transition-colors">Главная</Link>
            <ChevronRight />
            <Link href="/catalog" className="hover:text-gray-700 transition-colors">Каталог</Link>
            <ChevronRight />
            <span className="text-gray-700">{category.name}</span>
          </nav>
          <div className="flex flex-col gap-3 max-w-3xl">
            <h1 className="text-[24px] sm:text-[32px] md:text-[42px] font-bold tracking-tight text-gray-900">
              {category.name}
            </h1>
            <p className="text-[14px] sm:text-[16px] text-gray-500 leading-relaxed">
              {seo?.lead ??
                "Позиции категории на складе Ростехсталь в Бишкеке. Поможем подобрать размер, марку и доставку по Кыргызстану."}
            </p>
          </div>
        </div>
      </div>

      <div className="container pt-8 sm:pt-10 flex flex-col gap-8">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <p className="text-[14px] text-gray-500">
            <span className="font-semibold text-gray-900">{categoryProducts.length}</span> позиций в разделе
          </p>
          <div className="flex gap-2.5 flex-wrap">
            <Link
              href="/calculator"
              className="inline-flex items-center justify-center bg-white text-gray-700 font-semibold text-[13px] px-5 py-2.5 rounded-full border border-gray-200 hover:bg-gray-50 transition-all"
            >
              Калькулятор
            </Link>
            <Link
              href="/contacts"
              className="inline-flex items-center justify-center bg-brand-primary hover:bg-brand-primary/90 text-white font-semibold text-[13px] px-5 py-2.5 rounded-full shadow-sm transition-all"
            >
              Получить расчёт
            </Link>
          </div>
        </div>

        {categoryProducts.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {categoryProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center bg-gray-50 border border-gray-200 rounded-2xl">
            <p className="text-[15px] font-semibold text-gray-500 mb-3">В этой категории нет товаров</p>
            <Link href="/catalog" className="text-brand-primary font-semibold text-[13px] hover:underline">
              Показать все позиции
            </Link>
          </div>
        )}

        {seo && (
          <section className="mt-4 border-t border-gray-100 pt-10">
            <div className="flex flex-col gap-7 max-w-3xl">
              {seo.popular && seo.popular.length > 0 && (
                <div className="flex flex-col gap-3">
                  <h2 className="text-[20px] sm:text-[26px] font-bold tracking-tight text-gray-900">
                    {category.name} в Бишкеке — ходовые позиции
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {seo.popular.map((item) => (
                      <span
                        key={item}
                        className="inline-flex items-center bg-blue-50 text-brand-primary font-semibold text-[13px] px-3.5 py-1.5 rounded-full border border-blue-100"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {seo.sections.map((sec) => (
                <div key={sec.heading} className="flex flex-col gap-3">
                  <h3 className="text-[16px] sm:text-[18px] font-bold text-gray-900">{sec.heading}</h3>
                  {sec.paragraphs?.map((p, i) => (
                    <p key={i} className="text-[14px] sm:text-[15px] text-gray-600 leading-relaxed">
                      {p}
                    </p>
                  ))}
                  {sec.bullets && sec.bullets.length > 0 && (
                    <ul className="flex flex-col gap-2">
                      {sec.bullets.map((b) => (
                        <li key={b} className="flex items-start gap-2.5 text-[14px] sm:text-[15px] text-gray-600 leading-relaxed">
                          <span className="mt-[9px] w-1.5 h-1.5 rounded-full bg-brand-primary shrink-0" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}

              <div className="flex flex-wrap gap-2.5 pt-1">
                <Link
                  href="/calculator"
                  className="inline-flex items-center justify-center bg-white text-gray-700 font-semibold text-[13px] px-5 py-2.5 rounded-full border border-gray-200 hover:bg-gray-50 transition-all"
                >
                  Рассчитать в калькуляторе
                </Link>
                <Link
                  href="/contacts"
                  className="inline-flex items-center justify-center bg-brand-primary hover:bg-brand-primary/90 text-white font-semibold text-[13px] px-5 py-2.5 rounded-full shadow-sm transition-all"
                >
                  Узнать цену и наличие
                </Link>
              </div>
            </div>
          </section>
        )}

        <section className="mt-4 border-t border-gray-100 pt-10">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-bold uppercase tracking-widest text-brand-primary">Вопросы по разделу</span>
              <h2 className="text-[22px] sm:text-[28px] font-bold tracking-tight text-gray-900">
                Частые вопросы
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {faqs.map((faq) => (
                <div key={faq.question} className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col gap-2">
                  <h3 className="text-[14px] font-bold text-gray-900 leading-snug">{faq.question}</h3>
                  <p className="text-[13px] text-gray-500 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
