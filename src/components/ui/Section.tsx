"use client";
import React from "react";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  containerClassName?: string;
}

export const Section = ({
  children,
  className = "",
  id,
  containerClassName = "",
}: SectionProps) => {
  return (
    <section id={id} className={`w-full ${className}`}>
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${containerClassName}`}>
        {children}
      </div>
    </section>
  );
};
