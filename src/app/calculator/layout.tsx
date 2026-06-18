import type { Metadata } from "next";
import type { ReactNode } from "react";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Расчёт веса металлопроката — Ростехсталь Бишкек",
  description:
    "Онлайн-калькулятор веса и длины металлопроката для расчёта арматуры, труб, листового и фасонного проката перед заказом в Бишкеке.",
  path: "/calculator",
});

export default function CalculatorLayout({ children }: { children: ReactNode }) {
  return children;
}
