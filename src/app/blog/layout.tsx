import type { Metadata } from "next";
import type { ReactNode } from "react";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Блог о металлопрокате и строительстве — Ростехсталь",
  description:
    "Статьи Ростехсталь о выборе арматуры, профильных труб, листового проката, швеллера, защите металла и поставках по Кыргызстану.",
  path: "/blog",
});

export default function BlogLayout({ children }: { children: ReactNode }) {
  return children;
}
