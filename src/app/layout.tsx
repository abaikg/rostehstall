import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ModalProvider } from "@/context/ModalContext";
import { SiteChrome } from "@/components/common/SiteChrome";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildMetadata, getSiteUrl, organizationJsonLd } from "@/lib/seo";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  applicationName: "Ростехсталь",
  category: "business",
  manifest: "/site.webmanifest",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  ...buildMetadata({
    title: "Ростехсталь — металлопрокат в Бишкеке и Кыргызстане",
    description:
      "Металлобаза Ростехсталь: арматура, профильная труба, листовой прокат, швеллер, резка металла и доставка по Кыргызстану.",
    path: "/",
  }),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col font-sans bg-brand-bg text-brand-dark selection:bg-brand-primary selection:text-white">
        <JsonLd id="organization-localbusiness-jsonld" data={organizationJsonLd()} />
        <ModalProvider>
          <SiteChrome>{children}</SiteChrome>
        </ModalProvider>
      </body>
    </html>
  );
}
