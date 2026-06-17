import type { Metadata } from "next";
import type { ReactNode } from "react";
import { blogPosts } from "@/data/blog";
import { JsonLd } from "@/components/seo/JsonLd";
import { articleJsonLd, breadcrumbJsonLd, buildMetadata, jsonLdGraph, truncateMeta } from "@/lib/seo";

type BlogPostLayoutProps = {
  children: ReactNode;
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Omit<BlogPostLayoutProps, "children">): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((item) => item.slug === slug);

  if (!post) {
    return buildMetadata({
      title: "Статья не найдена — Ростехсталь",
      description: "Материал блога Ростехсталь не найден. Перейдите в раздел со статьями о металлопрокате.",
      path: `/blog/${slug}`,
      type: "article",
    });
  }

  return buildMetadata({
    title: `${post.title} — Ростехсталь`,
    description: truncateMeta(post.excerpt),
    path: `/blog/${post.slug}`,
    type: "article",
    keywords: [post.category, "блог о металлопрокате", "металлопрокат Кыргызстан"],
  });
}

export default async function BlogPostLayout({ children, params }: BlogPostLayoutProps) {
  const { slug } = await params;
  const post = blogPosts.find((item) => item.slug === slug);

  if (!post) return children;

  const jsonLd = jsonLdGraph([
    articleJsonLd(post),
    breadcrumbJsonLd([
      { name: "Главная", path: "/" },
      { name: "Блог", path: "/blog" },
      { name: post.title, path: `/blog/${post.slug}` },
    ]),
  ]);

  return (
    <>
      <JsonLd id="article-jsonld" data={jsonLd} />
      {children}
    </>
  );
}
