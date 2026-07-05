"use client";
import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { OrderModal } from "./OrderModal";
import { JivoChat } from "./JivoChat";
import { ConversionTracker } from "@/components/seo/ConversionTracker";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <OrderModal />
      <JivoChat />
      <ConversionTracker />
      <main className="flex-grow w-full pt-[60px] sm:pt-[72px] text-brand-dark">
        {children}
      </main>
      <Footer />
    </>
  );
}
