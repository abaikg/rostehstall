import type { Metadata } from "next";
import type { ReactNode } from "react";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Резка металла и услуги металлобазы в Бишкеке — Ростехсталь",
  description:
    "Услуги Ростехсталь: резка металла, перфорация, сварка металлоконструкций и логистика металлопроката по Бишкеку и регионам Кыргызстана.",
  path: "/services",
});

export default function ServicesLayout({ children }: { children: ReactNode }) {
  return children;
}
