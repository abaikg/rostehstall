import type { Metadata } from "next";
import type { ReactNode } from "react";
import { products } from "@/data/catalog";
import { JsonLd } from "@/components/seo/JsonLd";
import { getCategoryPath } from "@/lib/catalogRoutes";
import { getProductImage } from "@/lib/productImages";
import {
  breadcrumbJsonLd,
  buildMetadata,
  jsonLdGraph,
  productJsonLd,
  productMetaDescription,
} from "@/lib/seo";

type ProductLayoutProps = {
  children: ReactNode;
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Omit<ProductLayoutProps, "children">): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);

  if (!product) {
    return buildMetadata({
      title: "Товар не найден — Ростехсталь",
      description: "Страница товара не найдена. Перейдите в каталог металлопроката Ростехсталь.",
      path: `/catalog/${slug}`,
    });
  }

  return buildMetadata({
    title: `${product.name} в Бишкеке — Ростехсталь`,
    description: productMetaDescription(product),
    path: `/catalog/${product.slug}`,
    image: getProductImage(product),
    keywords: [product.name, product.category, `${product.category} Бишкек`],
  });
}

export default async function ProductLayout({ children, params }: ProductLayoutProps) {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);

  if (!product) return children;

  const jsonLd = jsonLdGraph([
    productJsonLd(product),
    breadcrumbJsonLd([
      { name: "Главная", path: "/" },
      { name: "Каталог", path: "/catalog" },
      { name: product.category, path: getCategoryPath(product.category) },
      { name: product.name, path: `/catalog/${product.slug}` },
    ]),
  ]);

  return (
    <>
      <JsonLd id="product-jsonld" data={jsonLd} />
      {children}
    </>
  );
}
