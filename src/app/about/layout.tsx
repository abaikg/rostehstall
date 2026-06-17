import type { Metadata } from "next";
import type { ReactNode } from "react";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "О компании Ростехсталь — металлобаза в Бишкеке",
  description:
    "Ростехсталь поставляет металлопрокат для строительных и промышленных компаний Кыргызстана: склад в Бишкеке, обработка металла и доставка.",
  path: "/about",
});

export default function AboutLayout({ children }: { children: ReactNode }) {
  return children;
}
