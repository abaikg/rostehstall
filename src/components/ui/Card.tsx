"use client";
import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

export const Card = ({ children, className = "", hoverable = false }: CardProps) => {
  return (
    <div 
      className={`
        bg-white rounded-xl border border-brand-border
        ${hoverable ? "transition-colors duration-150 hover:bg-gray-50" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
};
