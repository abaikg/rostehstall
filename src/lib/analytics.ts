/**
 * Единая отправка конверсий в Яндекс.Метрику и Google Analytics / Google Ads.
 * Срабатывает только если подключены соответствующие счётчики (см. Analytics.tsx).
 *
 * Цели для Метрики (создайте их в Метрике как «JavaScript-событие» с такими id):
 *   lead_form  — успешная отправка формы заявки
 *   whatsapp   — клик по ссылке WhatsApp
 *   phone      — клик по номеру телефона
 *
 * Для Google Ads задайте NEXT_PUBLIC_GOOGLE_ADS_SEND_TO вида "AW-1234567890/AbCdEf".
 */

type YmFn = (id: number, action: string, target?: string, params?: unknown) => void;
type GtagFn = (command: string, eventOrId: string, params?: Record<string, unknown>) => void;

declare global {
  interface Window {
    ym?: YmFn;
    gtag?: GtagFn;
  }
}

export type LeadGoal = "lead_form" | "whatsapp" | "phone";

const GA4_EVENT: Record<LeadGoal, string> = {
  lead_form: "generate_lead",
  whatsapp: "contact_whatsapp",
  phone: "contact_phone",
};

export function trackLead(goal: LeadGoal, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;

  // Яндекс.Метрика
  try {
    const ymId = Number(process.env.NEXT_PUBLIC_YM_ID);
    if (window.ym && Number.isFinite(ymId) && ymId > 0) {
      window.ym(ymId, "reachGoal", goal, params);
    }
  } catch {
    /* no-op */
  }

  // Google Analytics 4
  try {
    if (window.gtag) {
      window.gtag("event", GA4_EVENT[goal], params);

      // Конверсия Google Ads (только для главной цели — заявки)
      const adsSendTo = process.env.NEXT_PUBLIC_GOOGLE_ADS_SEND_TO?.trim();
      if (goal === "lead_form" && adsSendTo) {
        window.gtag("event", "conversion", { send_to: adsSendTo, ...params });
      }
    }
  } catch {
    /* no-op */
  }
}
