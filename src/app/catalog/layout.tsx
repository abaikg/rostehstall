import type { Metadata } from "next";
import type { ReactNode } from "react";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Каталог металлопроката в Бишкеке — Ростехсталь",
  description:
    "Каталог металлопроката Ростехсталь: арматура, профильная труба, листовой прокат, швеллер и другие позиции с доставкой по Кыргызстану.",
  path: "/catalog",
});

export default function CatalogLayout({ children }: { children: ReactNode }) {
  return children;
}
