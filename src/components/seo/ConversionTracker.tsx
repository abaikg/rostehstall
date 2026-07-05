"use client";
import { useEffect } from "react";
import { trackLead } from "@/lib/analytics";

/**
 * Делегированный слушатель кликов на весь сайт: ловит переходы по телефону
 * и WhatsApp в любых компонентах без правки каждой ссылки и отправляет цели.
 * Монтируется один раз в SiteChrome.
 */
export function ConversionTracker() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const link = target?.closest?.("a");
      if (!link) return;

      const href = link.getAttribute("href") || "";

      if (href.startsWith("tel:")) {
        trackLead("phone");
      } else if (/wa\.me|whatsapp|api\.whatsapp/i.test(href)) {
        trackLead("whatsapp");
      }
    };

    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
