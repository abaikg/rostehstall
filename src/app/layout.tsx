import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ModalProvider } from "@/context/ModalContext";
import { SiteChrome } from "@/components/common/SiteChrome";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Ростехсталь — Металлопрокат №1 в Кыргызстане",
  description: "Ведущий поставщик металлопроката. Арматура, трубы, листы, уголки и услуги обработки металла в Бишкеке.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col font-sans bg-brand-bg text-brand-dark selection:bg-brand-primary selection:text-white">
        <ModalProvider>
          <SiteChrome>{children}</SiteChrome>
        </ModalProvider>
      </body>
    </html>
  );
}
