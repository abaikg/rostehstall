import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductTable } from "@/components/features/catalog/ProductTable";
import { JsonLd } from "@/components/seo/JsonLd";
import { categorySeo } from "@/data/categorySeo";
import { getCategoryBySlug, getIndexedCategories, getProductsForCategory } from "@/lib/catalogRoutes";
import { getProducts } from "@/lib/db";
import { getProductImage } from "@/lib/productImages";
import {
  absoluteUrl,
  breadcrumbJsonLd,
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
        "Выберите позиции в таблице или отправьте заявку через форму. Менеджер уточнит размер, марку стали, объем и подготовит коммерческое предложение.",
    },
    {
      question: "Можно ли оформить доставку по Кыргызстану?",
      answer:
        "Да, Ростехсталь организует доставку металлопроката по Бишкеку и регионам Кыргызстана с учетом тоннажа и сроков поставки.",
    },
    {
      question: "Выполняется ли резка металла под размер?",
      answer:
        "Для подходящих позиций доступна резка металла под проектные размеры. Уточните параметры у менеджера при оформлении заявки.",
    },
  ];
}

// Общие фото склада/продукции — добавляют разнообразия к фото самого товара
// раздела (у многих подкатегорий все товары используют одно и то же фото).
const GENERIC_STOCK_PHOTOS = [
  "/images/hero/hero-metal-yard.jpg",
  "/images/hero/hero-warehouse-rebar.jpg",
  "/images/hero/hero-clean-stock.jpg",
  "/images/products/structural-profiles.png",
];

function buildCategoryGallery(categoryProducts: ReturnType<typeof getProductsForCategory>) {
  const photos: string[] = [];
  const seen = new Set<string>();

  const addPhoto = (src?: string) => {
    if (!src || seen.has(src)) return;
    seen.add(src);
    photos.push(src);
  };

  // Сначала — реальное фото товаров раздела (могут повторяться у похожих позиций)
  for (const product of categoryProducts) {
    if (photos.length >= 4) break;
    addPhoto(getProductImage(product));
  }
  // Затем — общие фото склада, чтобы добрать до 4 и разбавить повторы
  for (const photo of GENERIC_STOCK_PHOTOS) {
    if (photos.length >= 4) break;
    addPhoto(photo);
  }

  return photos;
}

export function generateStaticParams() {
  return getIndexedCategories(getProducts()).map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const products = getProducts();
  const category = getCategoryBySlug(slug, products);

  if (!category) {
    return buildMetadata({
      title: "Раздел не найден - Ростехсталь",
      description: "Раздел каталога Ростехсталь не найден. Перейдите в общий каталог металлопроката.",
      path: `/catalog/category/${slug}`,
    });
  }

  return buildMetadata({
    title: `${category.name} в Бишкеке - Ростехсталь`,
    description: categoryMetaDescription(category.name),
    path: category.path,
    keywords: [category.name, `${category.name} Бишкек`, `${category.name} Кыргызстан`],
  });
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const products = getProducts();
  const category = getCategoryBySlug(slug, products);

  if (!category) notFound();

  const categoryProducts = getProductsForCategory(category.name, products);
  const catalogSections = getIndexedCategories(products);
  const faqs = getCategoryFaq(category.name);
  // Разделы каталога — это узкие подкатегории (Арматура, Круг, Швеллер…), а
  // categorySeo написан для широких товарных групп (Сортовой прокат и т.п.).
  // Показываем текст широкой группы на всех её подкатегориях, если для самой
  // подкатегории отдельного текста нет.
  const parentCategoryName = categoryProducts[0]?.category ?? category.name;
  const seo = categorySeo[category.name] ?? categorySeo[parentCategoryName];
  const galleryPhotos = buildCategoryGallery(categoryProducts);
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

      <div className="border-b border-gray-100 pb-8 pt-8 sm:pt-12">
        <div className="container flex flex-col gap-4">
          <nav className="flex flex-wrap items-center gap-1.5 text-[12px] font-semibold text-gray-400">
            <Link href="/" className="transition-colors hover:text-gray-700">Главная</Link>
            <ChevronRight />
            <Link href="/catalog" className="transition-colors hover:text-gray-700">Каталог</Link>
            <ChevronRight />
            <span className="text-gray-700">{category.name}</span>
          </nav>

          <div className="flex max-w-3xl flex-col gap-3">
            <h1 className="text-[24px] font-bold tracking-tight text-gray-900 sm:text-[32px] md:text-[42px]">
              {category.name}
            </h1>
            <p className="text-[14px] leading-relaxed text-gray-500 sm:text-[16px]">
              {seo?.lead ??
                "Позиции раздела на складе Ростехсталь в Бишкеке. Поможем подобрать размер, марку и доставку по Кыргызстану."}
            </p>
          </div>
        </div>
      </div>

      <div className="container pt-8 sm:pt-10">
        <div className="flex items-start gap-8">
          <aside className="sticky top-[80px] hidden max-h-[calc(100vh-110px)] w-64 shrink-0 flex-col overflow-hidden rounded-lg border border-gray-200 bg-white md:flex lg:w-72">
            <div className="bg-brand-primary px-4 py-3 text-white">
              <p className="text-[13px] font-bold uppercase tracking-wide">Разделы каталога</p>
            </div>
            <nav className="flex-1 overflow-y-auto p-2">
              {catalogSections.map((section) => {
                const active = section.slug === category.slug;

                return (
                  <Link
                    key={section.slug}
                    href={section.path}
                    className={`flex items-center justify-between gap-3 rounded-md px-3 py-2.5 text-[13px] transition-colors ${
                      active
                        ? "bg-brand-primary font-bold text-white"
                        : "text-gray-700 hover:bg-blue-50 hover:text-brand-primary"
                    }`}
                  >
                    <span className="leading-snug">{section.name}</span>
                    <span className={`text-[11px] font-bold ${active ? "text-white/80" : "text-gray-400"}`}>
                      {section.productCount}
                    </span>
                  </Link>
                );
              })}
            </nav>
          </aside>

          <div className="flex min-w-0 flex-1 flex-col gap-8">
            <nav className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 md:hidden">
              {catalogSections.map((section) => {
                const active = section.slug === category.slug;

                return (
                  <Link
                    key={section.slug}
                    href={section.path}
                    className={`shrink-0 rounded-full border px-3 py-1.5 text-[12px] font-semibold ${
                      active
                        ? "border-brand-primary bg-brand-primary text-white"
                        : "border-gray-200 bg-white text-gray-700"
                    }`}
                  >
                    {section.name}
                  </Link>
                );
              })}
            </nav>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="text-[14px] text-gray-500">
                <span className="font-semibold text-gray-900">{categoryProducts.length}</span> позиций в разделе
              </p>
              <div className="flex flex-wrap gap-2.5">
                <Link
                  href="/calculator"
                  className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-[13px] font-semibold text-gray-700 transition-all hover:bg-gray-50"
                >
                  Калькулятор
                </Link>
                <Link
                  href="/contacts"
                  className="inline-flex items-center justify-center rounded-lg bg-brand-primary px-5 py-2.5 text-[13px] font-semibold text-white shadow-sm transition-all hover:bg-brand-primary/90"
                >
                  Получить расчет
                </Link>
              </div>
            </div>

            {categoryProducts.length > 0 ? (
              <ProductTable products={categoryProducts} />
            ) : (
              <div className="rounded-lg border border-gray-200 bg-gray-50 py-20 text-center">
                <p className="mb-3 text-[15px] font-semibold text-gray-500">В этом разделе нет товаров</p>
                <Link href="/catalog" className="text-[13px] font-semibold text-brand-primary hover:underline">
                  Показать все разделы
                </Link>
              </div>
            )}
          </div>
        </div>

        {seo && (
          <section className="mt-10 border-t border-gray-100 pt-10">
            <div className="flex flex-col gap-7">
              {seo.popular && seo.popular.length > 0 && (
                <div className="flex max-w-3xl flex-col gap-3">
                  <h2 className="text-[20px] font-bold tracking-tight text-gray-900 sm:text-[26px]">
                    {category.name} в Бишкеке - ходовые позиции
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {seo.popular.map((item) => (
                      <span
                        key={item}
                        className="inline-flex items-center rounded-lg border border-blue-100 bg-blue-50 px-3.5 py-1.5 text-[13px] font-semibold text-brand-primary"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
                {seo.sections.map((sec) => (
                  <div key={sec.heading} className="flex flex-col gap-3">
                    <h3 className="text-[16px] font-bold text-gray-900 sm:text-[18px]">{sec.heading}</h3>
                    {sec.paragraphs?.map((paragraph) => (
                      <p key={paragraph} className="text-[14px] leading-relaxed text-gray-600 sm:text-[15px]">
                        {paragraph}
                      </p>
                    ))}
                    {sec.bullets && sec.bullets.length > 0 && (
                      <ul className="flex flex-col gap-2">
                        {sec.bullets.map((bullet) => (
                          <li key={bullet} className="flex items-start gap-2.5 text-[14px] leading-relaxed text-gray-600 sm:text-[15px]">
                            <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-brand-primary" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="mt-10 border-t border-gray-100 pt-10">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-bold uppercase tracking-widest text-brand-primary">Вопросы по разделу</span>
              <h2 className="text-[22px] font-bold tracking-tight text-gray-900 sm:text-[28px]">
                Частые вопросы
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {faqs.map((faq) => (
                <div key={faq.question} className="flex flex-col gap-2 rounded-lg border border-gray-200 bg-white p-5">
                  <h3 className="text-[14px] font-bold leading-snug text-gray-900">{faq.question}</h3>
                  <p className="text-[13px] leading-relaxed text-gray-500">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {galleryPhotos.length > 0 && (
          <section className="mt-10 border-t border-gray-100 pt-10">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <span className="text-[11px] font-bold uppercase tracking-widest text-brand-primary">Фото</span>
                <h2 className="text-[22px] font-bold tracking-tight text-gray-900 sm:text-[28px]">
                  {category.name} на складе Ростехсталь
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                {galleryPhotos.map((photo) => (
                  <div key={photo} className="aspect-square overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo}
                      alt={`${category.name} в Бишкеке — фото со склада Ростехсталь`}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
