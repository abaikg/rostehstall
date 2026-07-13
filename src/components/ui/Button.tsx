"use client";
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "blue" | "white";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  className?: string;
  asChild?: boolean;
}

export const Button = ({
  variant = "primary",
  size = "md",
  children,
  className = "",
  asChild = false,
  ...props
}: ButtonProps) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-colors duration-150 cursor-pointer disabled:opacity-50 disabled:pointer-events-none rounded-xl";
  
  const variants = {
    primary: "bg-brand-primary text-white hover:bg-brand-primary/90 border border-transparent",
    secondary: "bg-white text-brand-dark border border-brand-border hover:bg-gray-50",
    blue: "bg-[#2563EB] text-white hover:bg-[#1E40AF] border border-transparent",
    white: "bg-white text-gray-900 border border-gray-200 hover:bg-gray-50",
    outline: "bg-transparent text-brand-dark border border-brand-border hover:border-brand-primary hover:text-brand-primary",
    ghost: "bg-transparent text-gray-600 border border-transparent hover:text-gray-900 hover:bg-gray-100",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-2.5 text-sm",
    lg: "px-8 py-3 text-base",
  };

  const combinedClassName = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<{ className?: string }>;
    return React.cloneElement(child, {
      className: `${combinedClassName} ${child.props?.className || ""}`,
      ...props,
    });
  }

  return (
    <button className={combinedClassName} {...props}>
      {children}
    </button>
  );
};
