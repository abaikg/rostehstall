"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { navLinks } from "@/data/navigation";
import { CONTACTS } from "@/lib/constants";
import { useOrderModal } from "@/context/ModalContext";

const TelegramIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
  </svg>
);

const PhoneIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 5.49 5.49l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z" />
  </svg>
);

const MailIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const PinIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const ClockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

export const Footer = () => {
  const { openModal } = useOrderModal();

  const platformLinks = navLinks.slice(0, 3);
  const companyLinks = navLinks.slice(3);

  return (
    <footer className="bg-[#0d1117] text-white mt-24">

      {/* ── Main body ── */}
      <div className="container pt-16 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-6 xl:gap-10 pb-14 border-b border-white/[0.08]">

          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-5 xl:col-span-4 flex flex-col gap-5">
            <Link href="/" className="inline-flex">
              <Image
                src="/images/logo.png"
                alt="Ростехсталь"
                width={160}
                height={42}
                className="h-8 w-auto brightness-0 invert opacity-90"
              />
            </Link>
            <p className="text-[14px] text-gray-400 leading-relaxed max-w-[300px]">
              Надёжные поставки металлопроката для строительства. Прямые контракты с заводами РФ и СНГ, доставка по всему Кыргызстану.
            </p>
            {/* Social pills */}
            <div className="flex items-center gap-2 flex-wrap">
              <a
                href="https://t.me/rostehstal"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/[0.07] hover:bg-white/[0.13] border border-white/[0.09] text-[12px] font-semibold text-gray-300 hover:text-white transition-all duration-200"
              >
                <TelegramIcon /> Telegram
              </a>
              <a
                href={`https://${CONTACTS.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/[0.07] hover:bg-white/[0.13] border border-white/[0.09] text-[12px] font-semibold text-gray-300 hover:text-white transition-all duration-200"
              >
                <WhatsAppIcon /> WhatsApp
              </a>
            </div>
          </div>

          {/* Platform links */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.14em] text-gray-500">
              Платформа
            </h4>
            <ul className="flex flex-col gap-3.5">
              {platformLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[14px] text-gray-400 font-medium hover:text-white transition-colors duration-150"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.14em] text-gray-500">
              Компания
            </h4>
            <ul className="flex flex-col gap-3.5">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[14px] text-gray-400 font-medium hover:text-white transition-colors duration-150"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacts */}
          <div className="sm:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col gap-5">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.14em] text-gray-500">
              Контакты
            </h4>
            <div className="flex flex-col gap-3.5">
              <a
                href={`tel:${CONTACTS.phoneRaw}`}
                className="text-[22px] font-bold tracking-tight text-white hover:text-brand-accent transition-colors duration-150"
              >
                {CONTACTS.phone}
              </a>
              <ul className="flex flex-col gap-2.5 text-[13px] text-gray-400">
                <li>
                  <a
                    href={`mailto:${CONTACTS.email}`}
                    className="inline-flex items-center gap-2 hover:text-white transition-colors duration-150"
                  >
                    <MailIcon /> {CONTACTS.email}
                  </a>
                </li>
                <li className="inline-flex items-start gap-2">
                  <PinIcon />
                  <span>{CONTACTS.address}</span>
                </li>
                <li className="inline-flex items-center gap-2 text-gray-500">
                  <ClockIcon /> {CONTACTS.workHours}
                </li>
              </ul>
            </div>
            <button
              onClick={openModal}
              className="mt-1 inline-flex items-center justify-center bg-brand-primary hover:bg-brand-primary/90 active:scale-[0.98] text-white text-[13px] font-semibold px-5 py-2.5 rounded-full transition-all duration-200 shadow-lg shadow-brand-primary/20 self-start"
            >
              Получить предложение
            </button>
          </div>

        </div>

        {/* ── Bottom bar ── */}
        <div className="pt-7 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[12px] text-gray-600 text-center sm:text-left">
            © {new Date().getFullYear()} ОсОО «Ростехсталь». Все права защищены.
          </p>
          <div className="flex items-center gap-4 sm:gap-6 flex-wrap justify-center">
            <Link href="#" className="text-[12px] text-gray-600 hover:text-gray-300 transition-colors duration-150">
              Политика конфиденциальности
            </Link>
            <Link href="#" className="text-[12px] text-gray-600 hover:text-gray-300 transition-colors duration-150">
              Условия использования
            </Link>
            <span className="px-2.5 py-1 bg-white/[0.05] border border-white/[0.08] rounded text-[10px] font-bold uppercase tracking-widest text-gray-600">
              ISO 9001:2015
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
