"use client";
import React, { createContext, useContext, useState } from "react";

export interface OrderModalData {
  productLabel?: string;
  materialName?: string;
}

interface ModalContextType {
  isModalOpen: boolean;
  openModal: (data?: OrderModalData) => void;
  closeModal: () => void;
  modalData: OrderModalData | null;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState<OrderModalData | null>(null);

  const openModal = (data?: OrderModalData) => {
    if (data) setModalData(data);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setModalData(null), 300); // clear after animation
  };

  return (
    <ModalContext.Provider value={{ isModalOpen, openModal, closeModal, modalData }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useOrderModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useOrderModal must be used within a ModalProvider");
  }
  return context;
};
