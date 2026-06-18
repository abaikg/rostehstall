"use client";
import React from "react";
import { MetalCalculator } from "@/components/calculator/MetalCalculator";

export default function CalculatorPage() {
  return (
    <div className="pb-10 pt-2 sm:pb-16 sm:pt-8">
      <div className="container">
        <MetalCalculator />
      </div>
    </div>
  );
}
