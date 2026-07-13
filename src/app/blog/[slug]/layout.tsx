import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
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

  // notFound() до отправки первого байта — настоящий HTTP 404 вместо 200
  if (!post) notFound();

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

  // Проверка в теле layout выполняется до отправки shell — настоящий HTTP 404
  if (!post) notFound();

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
