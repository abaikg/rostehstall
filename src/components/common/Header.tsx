"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { navLinks } from "@/data/navigation";
import { CONTACTS } from "@/lib/constants";
import { useOrderModal } from "@/context/ModalContext";

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { openModal } = useOrderModal();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-[0_1px_0_0_#e5e7eb,0_4px_16px_-4px_rgba(0,0,0,0.06)] py-3"
            : "bg-white border-b border-gray-100/80 py-4"
        }`}
      >
        <div className="container flex items-center justify-between gap-4">

          {/* Logo */}
          <Link href="/" className="shrink-0 flex items-center">
            <Image
              src="/images/logo.png"
              alt="Ростехсталь"
              width={180}
              height={46}
              className="h-8 sm:h-9 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation — pill container */}
          <nav className="hidden md:flex items-center">
            <div className="flex items-center gap-0.5 bg-gray-50 border border-gray-200/70 rounded-xl p-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 lg:px-5 py-2 rounded-xl text-[12px] font-bold uppercase tracking-normal transition-all duration-200 whitespace-nowrap ${
                    pathname === link.href
                      ? "bg-white text-gray-950 shadow-sm ring-1 ring-gray-200/60"
                      : "text-gray-700 hover:text-gray-950 hover:bg-white/70"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3 lg:gap-5 shrink-0">

            {/* Phone — xl+ */}
            <a
              href={`tel:${CONTACTS.phoneRaw}`}
              className="hidden xl:flex flex-col items-end leading-none group"
            >
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 group-hover:text-brand-primary transition-colors duration-200">
                Отдел продаж
              </span>
              <span className="text-[15px] font-bold text-gray-900 group-hover:text-brand-primary transition-colors duration-200 tracking-tight">
                {CONTACTS.phone}
              </span>
            </a>

            {/* CTA — sm+ */}
            <button
              onClick={openModal}
              className="hidden sm:flex items-center gap-2 bg-brand-primary hover:bg-brand-primary/90 active:scale-[0.97] text-white text-[13px] font-semibold px-5 py-2.5 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Оставить заявку
            </button>

            {/* Hamburger — md- */}
            <button
              className="md:hidden flex flex-col justify-center items-center gap-[5px] w-10 h-10 rounded-xl bg-gray-50 border border-gray-200 hover:bg-gray-100 active:scale-95 transition-all duration-200"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label={mobileMenuOpen ? "Закрыть меню" : "Открыть меню"}
              aria-expanded={mobileMenuOpen}
            >
              <span
                className={`block h-[2px] w-[18px] bg-gray-700 rounded-full transition-all duration-300 origin-center ${
                  mobileMenuOpen ? "rotate-45 translate-y-[7px]" : ""
                }`}
              />
              <span
                className={`block h-[2px] bg-gray-700 rounded-full transition-all duration-300 ${
                  mobileMenuOpen ? "w-0 opacity-0" : "w-[18px] opacity-100"
                }`}
              />
              <span
                className={`block h-[2px] w-[18px] bg-gray-700 rounded-full transition-all duration-300 origin-center ${
                  mobileMenuOpen ? "-rotate-45 -translate-y-[7px]" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile Menu ── */}
      <div
        className={`md:hidden fixed inset-0 z-40 transition-all duration-300 ${
          mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/25 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* Drawer panel */}
        <div
          className={`absolute inset-x-0 top-0 bg-white shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
            mobileMenuOpen ? "translate-y-0" : "-translate-y-full"
          }`}
        >
          {/* spacer matching header height */}
          <div className="h-[60px] sm:h-[68px]" />

          <div className="px-4 pb-6 pt-2">
            {/* Nav links */}
            <nav className="flex flex-col gap-1.5 mb-5">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center px-4 py-3.5 rounded-xl text-[13px] font-bold uppercase tracking-normal transition-all duration-150 ${
                    pathname === link.href
                      ? "bg-blue-50 text-brand-primary ring-1 ring-blue-100"
                      : "text-gray-800 hover:bg-gray-50 hover:text-gray-950"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Contact + CTA */}
            <div className="border-t border-gray-100 pt-5 flex flex-col gap-3">
              <a
                href={`tel:${CONTACTS.phoneRaw}`}
                className="flex items-center justify-center py-3.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-950 font-bold text-[17px] tracking-normal hover:bg-gray-100 transition-colors"
              >
                {CONTACTS.phone}
              </a>
              <button
                onClick={() => { openModal(); setMobileMenuOpen(false); }}
                className="flex items-center justify-center bg-brand-primary hover:bg-brand-primary/90 text-white font-bold uppercase tracking-normal py-3.5 rounded-xl text-[13px] transition-colors active:scale-[0.98]"
              >
                Оставить заявку
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
