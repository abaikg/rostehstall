"use client";
import React from "react";
import { useOrderModal } from "@/context/ModalContext";

interface CatalogCtaButtonProps {
  className?: string;
  children: React.ReactNode;
  /** Название товара — подставляется в форму заявки как предмет запроса */
  productLabel?: string;
}

/** Кнопка «Оставить заявку» / «Запросить прайс-лист» — единственный
 * интерактивный (client) кусочек страницы каталога, чтобы сам список
 * категорий мог остаться серверным компонентом и попадать в HTML для SEO. */
export const CatalogCtaButton = ({ className, children, productLabel }: CatalogCtaButtonProps) => {
  const { openModal } = useOrderModal();

  return (
    <button
      type="button"
      onClick={() => openModal(productLabel ? { productLabel } : undefined)}
      className={className}
    >
      {children}
    </button>
  );
};
