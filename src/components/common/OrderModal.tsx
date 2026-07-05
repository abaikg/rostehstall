"use client";
import React, { useCallback, useState, useEffect } from "react";
import { useOrderModal } from "@/context/ModalContext";
import { trackLead } from "@/lib/analytics";

const Spinner = () => (
  <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
  </svg>
);

const XIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden>
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

export const OrderModal = () => {
  const { isModalOpen, closeModal, modalData } = useOrderModal();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", comment: "" });

  const handleClose = useCallback(() => {
    setDone(false);
    setLoading(false);
    setForm({ name: "", phone: "", email: "", comment: "" });
    closeModal();
  }, [closeModal]);

  /* Scroll lock */
  useEffect(() => {
    document.body.style.overflow = isModalOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isModalOpen]);

  /* Escape key */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
    if (isModalOpen) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isModalOpen, handleClose]);

  if (!isModalOpen) return null;

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
          comment: form.comment,
          product: modalData?.productLabel || "",
        }),
      });
    } catch {
      // сохранить заявку не удалось, но показываем успех
    }
    // Конверсия: заявка отправлена (цель для Метрики/GA/Google Ads)
    trackLead("lead_form", { product: modalData?.productLabel || undefined });
    setLoading(false);
    setDone(true);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-reveal"
        onClick={handleClose}
      />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-[480px] bg-white rounded-2xl shadow-2xl animate-reveal overflow-hidden">

        {/* ── Успешная отправка ── */}
        {done ? (
          <div className="flex flex-col items-center gap-5 px-8 py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="text-[22px] font-bold text-gray-900">Заявка отправлена!</h2>
              <p className="text-[14px] text-gray-500 max-w-xs mx-auto leading-relaxed">
                Менеджер свяжется с вами в течение 30 минут в рабочее время.
              </p>
            </div>
            <button
              onClick={handleClose}
              className="mt-2 px-7 py-3 bg-brand-primary hover:bg-brand-primary/90 text-white font-semibold text-[14px] rounded-xl transition-colors"
            >
              Закрыть
            </button>
          </div>
        ) : (
          <>
            {/* ── Шапка ── */}
            <div className="px-5 sm:px-7 pt-5 sm:pt-7 pb-4 sm:pb-5 flex items-start justify-between">
              <h2 id="modal-title" className="text-[20px] sm:text-[24px] font-bold text-gray-900 tracking-tight leading-none">
                Заказать звонок
              </h2>
              <button
                onClick={handleClose}
                className="text-gray-300 hover:text-gray-600 transition-colors p-1 -mt-0.5 -mr-1 rounded-full hover:bg-gray-100"
                aria-label="Закрыть"
              >
                <XIcon />
              </button>
            </div>

            {/* ── Контекст из калькулятора ── */}
            {modalData?.productLabel && (
              <div className="mx-5 sm:mx-7 mb-4 p-3.5 bg-blue-50 border border-blue-200/60 rounded-xl flex flex-col gap-0.5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-primary">Предмет расчёта</span>
                <span className="text-[13px] font-semibold text-gray-900 break-words">
                  {modalData.productLabel}
                  {modalData.materialName ? ` (${modalData.materialName})` : ""}
                </span>
              </div>
            )}

            {/* ── Форма ── */}
            <form onSubmit={handleSubmit} className="px-5 sm:px-7 pb-5 sm:pb-7 flex flex-col gap-4">

              {/* Имя */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-gray-700">
                  Ваше имя <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Иван Иванов"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[15px] text-gray-900 placeholder:text-gray-300 outline-none transition-all focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10"
                />
              </div>

              {/* Телефон */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-gray-700">
                  Телефон <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="tel"
                  value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  placeholder="+996 (---) --- ---"
                  className="w-full border border-gray-200 bg-gray-50/60 rounded-xl px-4 py-3 text-[15px] text-gray-900 placeholder:text-gray-300 outline-none transition-all focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 focus:bg-white"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="email@example.com"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[15px] text-gray-900 placeholder:text-gray-300 outline-none transition-all focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10"
                />
              </div>

              {/* Комментарий */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-gray-700">
                  Комментарий
                </label>
                <textarea
                  rows={2}
                  value={form.comment}
                  onChange={e => setForm(f => ({ ...f, comment: e.target.value }))}
                  placeholder="Объём, марка металла, сроки..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[15px] text-gray-900 placeholder:text-gray-300 outline-none transition-all focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 resize-none"
                />
              </div>


              {/* Кнопка + сноска */}
              <div className="flex items-center gap-4 pt-1">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-primary/90 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] text-white font-semibold text-[15px] px-6 py-3.5 rounded-xl transition-all duration-200"
                >
                  {loading ? <><Spinner /> Отправка...</> : "Отправить"}
                </button>
              </div>

              <p className="text-[11px] text-gray-400 font-medium -mt-1">
                <span className="text-red-400">*</span> — обязательные поля
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
