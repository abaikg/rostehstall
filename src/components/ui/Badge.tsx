"use client";
import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "blue" | "white";
  className?: string;
}

export const Badge = ({ children, variant = "primary", className = "" }: BadgeProps) => {
  const variants = {
    primary: "bg-blue-50 text-brand-primary border-blue-100",
    secondary: "bg-gray-100 text-gray-800 border-gray-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    white: "bg-white text-gray-800 border-gray-200",
    outline: "bg-transparent text-gray-600 border-gray-300",
  };

  return (
    <span 
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold tracking-wide border
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
};
