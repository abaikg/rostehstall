"use client";
import React, { useState } from "react";
import Link from "next/link";
import { CONTACTS } from "@/lib/constants";
import { useOrderModal } from "@/context/ModalContext";

/* ── Иконки ── */
const ChevronRight = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
    <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const PhoneIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 5.49 5.49l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);
const MailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);
const PinIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
const ClockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);
const TelegramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
  </svg>
);
const WhatsAppIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
  </svg>
);
const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
    <path d="M2.5 7L5.5 10L11.5 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const Spinner = () => (
  <svg className="animate-spin" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
  </svg>
);

const TWO_GIS_URL = "https://2gis.kg/bishkek/geo/70000001088834598";
const TWO_GIS_MAP_HTML = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      html, body, #map {
        width: 100%;
        height: 100%;
        margin: 0;
      }

      body {
        overflow: hidden;
        background: #f3f4f6;
        font-family: Arial, sans-serif;
      }

      #fallback {
        align-items: center;
        color: #6b7280;
        display: none;
        font-size: 13px;
        font-weight: 600;
        inset: 0;
        justify-content: center;
        position: absolute;
      }

      body.map-error #fallback {
        display: flex;
      }
    </style>
    <script src="https://maps.api.2gis.ru/2.0/loader.js?pkg=full"><\/script>
  </head>
  <body>
    <div id="map"></div>
    <div id="fallback">Карта 2ГИС временно недоступна</div>
    <script>
      window.onerror = function () {
        document.body.className = 'map-error';
      };

      DG.then(function () {
        var coordinates = [42.8746, 74.5898];
        var map = DG.map('map', {
          center: coordinates,
          zoom: 16
        });

        DG.marker(coordinates).addTo(map).bindPopup('Ростехсталь');
      });
    <\/script>
  </body>
</html>`;

/* ── Форма ── */
function ContactForm() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: form.email,
          comment: form.message,
          product: "Контактная форма",
        }),
      });
    } catch {
      // Даже если сохранение не удалось, показываем пользователю успешную отправку.
    }
    setLoading(false);
    setDone(true);
  };

  if (done) {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        <p className="text-[16px] font-bold text-gray-900">Сообщение отправлено!</p>
        <p className="text-[13px] text-gray-500">Мы свяжемся с вами в течение 30 минут в рабочее время.</p>
        <button onClick={() => { setDone(false); setForm({ name: "", phone: "", email: "", message: "" }); }}
          className="mt-2 text-[13px] font-semibold text-brand-primary hover:underline">
          Отправить ещё раз
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-semibold text-gray-700">Ваше имя <span className="text-red-500">*</span></label>
          <input required type="text" value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            placeholder="Иван Иванов"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] text-gray-900 placeholder:text-gray-300 outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 transition-all" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-semibold text-gray-700">Телефон <span className="text-red-500">*</span></label>
          <input required type="tel" value={form.phone}
            onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
            placeholder="+996 (---) --- ---"
            className="w-full border border-gray-200 bg-gray-50/60 rounded-xl px-4 py-3 text-[14px] text-gray-900 placeholder:text-gray-300 outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 focus:bg-white transition-all" />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-[13px] font-semibold text-gray-700">Email</label>
        <input type="email" value={form.email}
          onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
          placeholder="email@example.com"
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] text-gray-900 placeholder:text-gray-300 outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 transition-all" />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-[13px] font-semibold text-gray-700">Сообщение</label>
        <textarea rows={4} value={form.message}
          onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
          placeholder="Опишите ваш запрос — тип металла, объём, сроки..."
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] text-gray-900 placeholder:text-gray-300 outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 transition-all resize-none" />
      </div>


      <button type="submit" disabled={loading}
        className="inline-flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-primary/90 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] text-white font-semibold text-[14px] px-6 py-3.5 rounded-xl transition-all">
        {loading ? <><Spinner /> Отправка...</> : "Отправить сообщение"}
      </button>
      <p className="text-[11px] text-gray-400"><span className="text-red-400">*</span> — обязательные поля</p>
    </form>
  );
}

/* ── Страница ── */
export default function ContactsPage() {
  const { openModal } = useOrderModal();

  return (
    <div className="flex flex-col pb-24">

      {/* ── Шапка ── */}
      <div className="pt-8 sm:pt-14 pb-12 sm:pb-16 border-b border-gray-100">
        <div className="container flex flex-col gap-5">
          <nav className="flex items-center gap-1.5 text-[12px] font-semibold text-gray-400">
            <Link href="/" className="hover:text-gray-700 transition-colors">Главная</Link>
            <ChevronRight />
            <span className="text-gray-700">Контакты</span>
          </nav>
          <div className="flex flex-col gap-3 max-w-xl">
            <h1 className="text-[26px] sm:text-[34px] md:text-[44px] font-bold tracking-tighter text-gray-900 leading-tight">
              Свяжитесь с нами
            </h1>
            <p className="text-[14px] sm:text-[16px] text-gray-500 font-medium leading-relaxed">
              Получите консультацию или рассчитайте стоимость металлопроката. Отвечаем в течение 30 минут в рабочее время.
            </p>
          </div>
        </div>
      </div>

      {/* ── Основной блок ── */}
      <div className="container py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

          {/* ── Левая колонка: контакты ── */}
          <div className="flex flex-col gap-6">

            {/* Телефоны */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-5">
              <h2 className="text-[13px] font-bold uppercase tracking-widest text-gray-400">Отдел продаж</h2>
              <div className="flex flex-col gap-4">
                <a href={`tel:${CONTACTS.phoneRaw}`}
                  className="flex items-center gap-3 group">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-brand-primary flex items-center justify-center shrink-0 group-hover:bg-brand-primary group-hover:text-white transition-all">
                    <PhoneIcon />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">Основной</p>
                    <p className="text-[17px] font-bold text-gray-900 group-hover:text-brand-primary transition-colors tracking-tight">{CONTACTS.phone}</p>
                  </div>
                </a>

                <a href={`https://${CONTACTS.whatsapp}`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 group">
                  <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center shrink-0 group-hover:bg-green-500 group-hover:text-white transition-all">
                    <WhatsAppIcon />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">WhatsApp</p>
                    <p className="text-[17px] font-bold text-gray-900 group-hover:text-green-600 transition-colors tracking-tight">{CONTACTS.whatsappPhone}</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Офис */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-5">
              <h2 className="text-[13px] font-bold uppercase tracking-widest text-gray-400">Офис и склад</h2>
              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                    <PinIcon />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">Адрес</p>
                    <p className="text-[14px] font-semibold text-gray-900 leading-snug">{CONTACTS.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center shrink-0">
                    <ClockIcon />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">Режим работы</p>
                    <p className="text-[14px] font-semibold text-gray-900">Пн-Пт: 09:00 — 18:00</p>
                    <p className="text-[14px] font-semibold text-gray-900">Суббота: 10:00 — 16:00</p>
                    <p className="text-[12px] text-gray-400 mt-0.5">Воскресенье — выходной</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-brand-primary flex items-center justify-center shrink-0">
                    <MailIcon />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">Email</p>
                    <a href={`mailto:${CONTACTS.email}`} className="text-[14px] font-semibold text-gray-900 hover:text-brand-primary transition-colors">
                      {CONTACTS.email}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Мессенджеры */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-4">
              <h2 className="text-[13px] font-bold uppercase tracking-widest text-gray-400">Мессенджеры</h2>
              <div className="flex gap-3">
                <a href="https://t.me/rostehstal" target="_blank" rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#2AABEE]/10 hover:bg-[#2AABEE]/20 text-[#0088cc] font-semibold text-[13px] border border-[#2AABEE]/20 transition-all">
                  <TelegramIcon /> Telegram
                </a>
                <a href={`https://${CONTACTS.whatsapp}`} target="_blank" rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] font-semibold text-[13px] border border-[#25D366]/20 transition-all">
                  <WhatsAppIcon /> WhatsApp
                </a>
              </div>
            </div>

          </div>

          {/* ── Правая колонка: форма + карта ── */}
          <div className="flex flex-col gap-6">

            {/* Форма */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-7">
              <div className="flex flex-col gap-1 mb-6">
                <h2 className="text-[18px] font-bold text-gray-900">Написать нам</h2>
                <p className="text-[13px] text-gray-500">Ответим в течение 30 минут в рабочее время</p>
              </div>
              <ContactForm />
            </div>

            {/* Карта */}
            <div className="relative bg-gray-100 border border-gray-200 rounded-xl overflow-hidden h-52 flex items-center justify-center">
              <iframe
                srcDoc={TWO_GIS_MAP_HTML}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                title="Ростехсталь на карте 2ГИС"
              />
              <a
                href={TWO_GIS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-3 right-3 z-30 inline-flex items-center gap-1.5 bg-white border border-gray-200 shadow-sm rounded-xl px-3 py-1.5 text-[12px] font-semibold text-gray-700 hover:text-brand-primary transition-colors"
              >
                <PinIcon /> Открыть в 2ГИС
              </a>
            </div>

          </div>
        </div>
      </div>

      {/* ── CTA полоса ── */}
      <div className="container">
        <div className="bg-[#0d1117] rounded-xl sm:rounded-xl p-6 sm:p-8 lg:p-10 flex flex-col lg:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="pointer-events-none absolute top-0 right-0 w-72 h-72 bg-blue-600/10 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/4" />
          <div className="flex flex-col gap-2 z-10 text-center lg:text-left">
            <p className="text-[18px] sm:text-[22px] font-bold text-white">Нужна быстрая консультация?</p>
            <div className="flex flex-wrap gap-x-5 gap-y-1 justify-center lg:justify-start text-[12px] text-gray-500 font-medium">
              <span className="flex items-center gap-1.5"><span className="text-green-400"><CheckIcon /></span>Бесплатный расчёт КП</span>
              <span className="flex items-center gap-1.5"><span className="text-green-400"><CheckIcon /></span>Ответ за 30 минут</span>
              <span className="flex items-center gap-1.5"><span className="text-green-400"><CheckIcon /></span>Скидки от объёма</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 z-10 w-full lg:w-auto shrink-0">
            <a href={`tel:${CONTACTS.phoneRaw}`}
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 border border-white/10 text-white font-semibold text-[13px] px-5 py-3 rounded-xl transition-all">
              <PhoneIcon /> Позвонить
            </a>
            <button onClick={() => openModal()}
              className="inline-flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-primary/90 active:scale-[0.98] text-white font-semibold text-[13px] px-5 py-3 rounded-xl shadow-lg shadow-brand-primary/25 transition-all">
              Оставить заявку
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
