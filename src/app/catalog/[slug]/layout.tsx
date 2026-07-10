import type { Metadata } from "next";
import type { ReactNode } from "react";
import { JsonLd } from "@/components/seo/JsonLd";
import { getCategoryPath, getPublicProductGroup } from "@/lib/catalogRoutes";
import { getProducts } from "@/lib/db";
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
  const products = getProducts();
  const product = products.find((item) => item.slug === slug);

  if (!product) {
    return buildMetadata({
      title: "Товар не найден — Ростехсталь",
      description: "Страница товара не найдена. Перейдите в каталог металлопроката Ростехсталь.",
      path: `/catalog/${slug}`,
    });
  }

  const productGroup = getPublicProductGroup(product);

  return buildMetadata({
    title: `${product.name} в Бишкеке — Ростехсталь`,
    description: productMetaDescription(product),
    path: `/catalog/${product.slug}`,
    image: getProductImage(product),
    keywords: [product.name, productGroup, `${productGroup} Бишкек`],
  });
}

export default async function ProductLayout({ children, params }: ProductLayoutProps) {
  const { slug } = await params;
  const products = getProducts();
  const product = products.find((item) => item.slug === slug);

  if (!product) return children;

  const productGroup = getPublicProductGroup(product);
  const jsonLd = jsonLdGraph([
    productJsonLd(product),
    breadcrumbJsonLd([
      { name: "Главная", path: "/" },
      { name: "Каталог", path: "/catalog" },
      { name: productGroup, path: getCategoryPath(productGroup) },
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
