import type { Metadata } from "next";
import type { ReactNode } from "react";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Контакты металлобазы Ростехсталь в Бишкеке",
  description:
    "Контакты Ростехсталь в Бишкеке: телефон, WhatsApp, адрес офиса и склада, заявка на металлопрокат, резку металла и доставку по Кыргызстану.",
  path: "/contacts",
});

export default function ContactsLayout({ children }: { children: ReactNode }) {
  return children;
}
