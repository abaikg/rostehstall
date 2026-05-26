"use client";
import React, { createContext, useContext, useState } from "react";

interface ModalContextType {
  isModalOpen: boolean;
  openModal: (data?: any) => void;
  closeModal: () => void;
  modalData?: any;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState<any>(null);

  const openModal = (data?: any) => {
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
