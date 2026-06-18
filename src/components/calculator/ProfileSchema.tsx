"use client";
import React from "react";
import { ProductCode } from "@/lib/metal-calculator/types";

interface ProfileSchemaProps {
  type: ProductCode | string;
  className?: string;
}

const SvgBlueprint = ({
  children,
  viewBox = "0 0 150 150",
  className = "",
}: {
  children: React.ReactNode;
  viewBox?: string;
  className?: string;
}) => (
  <div className={`relative flex items-center justify-center p-3 sm:p-4 bg-white w-full h-full ${className}`}>
    <svg
      viewBox={viewBox}
      className="w-full h-full max-w-[190px] max-h-[190px] sm:max-w-[220px] sm:max-h-[220px] text-gray-900"
      fill="currentColor"
    >
      <defs>
        <pattern id="hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="6" stroke="#d1d5db" strokeWidth="0.8" />
        </pattern>
        <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M 0 1 L 10 5 L 0 9 z" fill="#000" />
        </marker>
      </defs>
      {children}
    </svg>
  </div>
);

export const ProfileSchema = ({ type }: ProfileSchemaProps) => {
  switch (type) {
    case "pipe_round":
      return (
        <SvgBlueprint>
          {/* Outer and Inner Circle using EvenOdd to crop center */}
          <path d="M75 15A60 60 0 1075 135A60 60 0 1075 15z M75 30A45 45 0 1175 120A45 45 0 1175 30z" fill="url(#hatch)" stroke="#000" strokeWidth="1.5" fillRule="evenodd" />
          
          {/* Inner wall rim for the hollow profile */}
          <circle cx="75" cy="75" r="45" fill="none" stroke="#000" strokeWidth="1.5" />

          {/* D: Diameter Arrow through center */}
          <line x1="28" y1="36" x2="114" y2="108" stroke="#000" strokeWidth="1" markerEnd="url(#arrow)" markerStart="url(#arrow)" />
          <text x="110" y="125" fontSize="12" fontWeight="bold" fill="#000">d</text>
          <line x1="114" y1="108" x2="130" y2="125" stroke="#000" strokeWidth="0.5" />

          {/* t: Thickness Arrow */}
          <line x1="110" y1="42" x2="135" y2="35" stroke="#000" strokeWidth="1" markerStart="url(#arrow)" />
          <line x1="135" y1="35" x2="145" y2="35" stroke="#000" strokeWidth="0.5" />
          <text x="135" y="30" fontSize="12" fontWeight="bold" fill="#000">t</text>
          {/* Inner wall arrow pointing to center of thickness */}
          <line x1="100" y1="52" x2="90" y2="60" stroke="#000" strokeWidth="1" markerStart="url(#arrow)" />
        </SvgBlueprint>
      );

    case "angle":
      return (
        <SvgBlueprint>
          {/* L shape hatched */}
          <path d="M40 20h20v60h50v20H40V20z" fill="url(#hatch)" stroke="#000" strokeWidth="1.5" />
          
          {/* b: vertical length */}
          <line x1="30" y1="20" x2="30" y2="100" stroke="#000" strokeWidth="1" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
          <text x="20" y="65" fontSize="12" fontWeight="bold" fill="#000">b</text>
          <line x1="40" y1="20" x2="25" y2="20" stroke="#000" strokeWidth="0.5" />
          <line x1="40" y1="100" x2="25" y2="100" stroke="#000" strokeWidth="0.5" />

          {/* a: horizontal length */}
          <line x1="40" y1="110" x2="110" y2="110" stroke="#000" strokeWidth="1" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
          <text x="75" y="125" fontSize="12" fontWeight="bold" fill="#000">a</text>
          <line x1="40" y1="100" x2="40" y2="115" stroke="#000" strokeWidth="0.5" />
          <line x1="110" y1="100" x2="110" y2="115" stroke="#000" strokeWidth="0.5" />

          {/* t: thickness */}
          <line x1="120" y1="80" x2="120" y2="100" stroke="#000" strokeWidth="1" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
          <text x="125" y="95" fontSize="12" fontWeight="bold" fill="#000">t</text>
          <line x1="110" y1="80" x2="125" y2="80" stroke="#000" strokeWidth="0.5" />
          <line x1="110" y1="100" x2="125" y2="100" stroke="#000" strokeWidth="0.5" />
        </SvgBlueprint>
      );

    case "pipe_profile":
      return (
        <SvgBlueprint>
          {/* Hollow rectangle shape using evenodd */}
          <path d="M30 30h90v90H30V30zm15 15v60h60V45H45z" fill="url(#hatch)" stroke="#000" strokeWidth="1.5" fillRule="evenodd" />
          <rect x="45" y="45" width="60" height="60" fill="none" stroke="#000" strokeWidth="1.5" />

          {/* A (horizontal outer) */}
          <line x1="30" y1="20" x2="120" y2="20" stroke="#000" strokeWidth="1" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
          <text x="75" y="15" fontSize="12" fontWeight="bold" fill="#000">A</text>
          <line x1="30" y1="30" x2="30" y2="15" stroke="#000" strokeWidth="0.5" />
          <line x1="120" y1="30" x2="120" y2="15" stroke="#000" strokeWidth="0.5" />

          {/* B (vertical outer) */}
          <line x1="20" y1="30" x2="20" y2="120" stroke="#000" strokeWidth="1" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
          <text x="5" y="80" fontSize="12" fontWeight="bold" fill="#000">B</text>
          <line x1="30" y1="30" x2="15" y2="30" stroke="#000" strokeWidth="0.5" />
          <line x1="30" y1="120" x2="15" y2="120" stroke="#000" strokeWidth="0.5" />

          {/* s (thickness) */}
          <line x1="130" y1="30" x2="130" y2="45" stroke="#000" strokeWidth="1" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
          <text x="135" y="42" fontSize="12" fontWeight="bold" fill="#000">s</text>
          <line x1="120" y1="30" x2="135" y2="30" stroke="#000" strokeWidth="0.5" />
          <line x1="105" y1="45" x2="135" y2="45" stroke="#000" strokeWidth="0.5" />
        </SvgBlueprint>
      );

    case "sheet":
    case "strip":
      return (
        <SvgBlueprint viewBox="0 0 200 150">
          <rect x="25" y="60" width="150" height="30" fill="url(#hatch)" stroke="#000" strokeWidth="1.5" />
          {/* Thickness T */}
          <line x1="185" y1="60" x2="185" y2="90" stroke="#000" strokeWidth="1" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
          <text x="190" y="80" fontSize="12" fontWeight="bold" fill="#000">s</text>
          
          <line x1="175" y1="60" x2="190" y2="60" stroke="#000" strokeWidth="0.5" />
          <line x1="175" y1="90" x2="190" y2="90" stroke="#000" strokeWidth="0.5" />
          
          {/* Width L */}
          <line x1="25" y1="100" x2="175" y2="100" stroke="#000" strokeWidth="1" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
          <text x="100" y="115" fontSize="12" fontWeight="bold" fill="#000">a</text>
          <line x1="25" y1="90" x2="25" y2="105" stroke="#000" strokeWidth="0.5" />
          <line x1="175" y1="90" x2="175" y2="105" stroke="#000" strokeWidth="0.5" />
        </SvgBlueprint>
      );

    case "circle":
    case "wire":
    case "rebar":
      return (
        <SvgBlueprint>
          {/* Rebar keeps a simple circular outline for accuracy */}
          <circle cx="75" cy="75" r="50" fill="url(#hatch)" stroke="#000" strokeWidth="1.5" />
          
          {/* Diameter */}
          <line x1="25" y1="75" x2="125" y2="75" stroke="#000" strokeWidth="1" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
          <text x="75" y="70" fontSize="12" fontWeight="bold" fill="#000">D</text>
        </SvgBlueprint>
      );

    case "square":
      return (
        <SvgBlueprint>
          <rect x="35" y="35" width="80" height="80" fill="url(#hatch)" stroke="#000" strokeWidth="1.5" />
          
          <line x1="125" y1="35" x2="125" y2="115" stroke="#000" strokeWidth="1" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
          <text x="132" y="80" fontSize="12" fontWeight="bold" fill="#000">a</text>
          <line x1="115" y1="35" x2="130" y2="35" stroke="#000" strokeWidth="0.5" />
          <line x1="115" y1="115" x2="130" y2="115" stroke="#000" strokeWidth="0.5" />

          <line x1="35" y1="125" x2="115" y2="125" stroke="#000" strokeWidth="1" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
          <text x="75" y="140" fontSize="12" fontWeight="bold" fill="#000">a</text>
          <line x1="35" y1="115" x2="35" y2="130" stroke="#000" strokeWidth="0.5" />
          <line x1="115" y1="115" x2="115" y2="130" stroke="#000" strokeWidth="0.5" />
        </SvgBlueprint>
      );

    case "channel":
      return (
        <SvgBlueprint>
           {/* C bracket */}
           <path d="M40 20h60v15H55v80h45v15H40V20z" fill="url(#hatch)" stroke="#000" strokeWidth="1.5" />

           {/* h: Height outer */}
           <line x1="25" y1="20" x2="25" y2="130" stroke="#000" strokeWidth="1" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
           <text x="15" y="80" fontSize="12" fontWeight="bold" fill="#000">h</text>
           <line x1="40" y1="20" x2="20" y2="20" stroke="#000" strokeWidth="0.5" />
           <line x1="40" y1="130" x2="20" y2="130" stroke="#000" strokeWidth="0.5" />

           {/* b: Flange width */}
           <line x1="40" y1="10" x2="100" y2="10" stroke="#000" strokeWidth="1" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
           <text x="70" y="5" fontSize="12" fontWeight="bold" fill="#000">b</text>
           <line x1="40" y1="20" x2="40" y2="5" stroke="#000" strokeWidth="0.5" />
           <line x1="100" y1="20" x2="100" y2="5" stroke="#000" strokeWidth="0.5" />

           {/* s: Web thickness */}
           <line x1="40" y1="140" x2="55" y2="140" stroke="#000" strokeWidth="1" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
           <text x="47" y="155" fontSize="12" fontWeight="bold" fill="#000">s</text>
           <line x1="40" y1="130" x2="40" y2="145" stroke="#000" strokeWidth="0.5" />
           <line x1="55" y1="130" x2="55" y2="145" stroke="#000" strokeWidth="0.5" />
        </SvgBlueprint>
      );

    case "beam":
      return (
        <SvgBlueprint>
           {/* H / I Beam */}
           <path d="M30 20h90v15H82.5v80H120v15H30v-15h37.5v-80H30V20z" fill="url(#hatch)" stroke="#000" strokeWidth="1.5" />
           
           {/* h: Height */}
           <line x1="15" y1="20" x2="15" y2="130" stroke="#000" strokeWidth="1" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
           <text x="5" y="80" fontSize="12" fontWeight="bold" fill="#000">h</text>
           <line x1="30" y1="20" x2="10" y2="20" stroke="#000" strokeWidth="0.5" />
           <line x1="30" y1="130" x2="10" y2="130" stroke="#000" strokeWidth="0.5" />

           {/* b: Width */}
           <line x1="30" y1="10" x2="120" y2="10" stroke="#000" strokeWidth="1" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
           <text x="75" y="5" fontSize="12" fontWeight="bold" fill="#000">b</text>
           <line x1="30" y1="20" x2="30" y2="5" stroke="#000" strokeWidth="0.5" />
           <line x1="120" y1="20" x2="120" y2="5" stroke="#000" strokeWidth="0.5" />
        </SvgBlueprint>
      );

    case "hexagon":
      return (
        <SvgBlueprint>
          {/* Hex */}
          <polygon points="75,25 118,50 118,100 75,125 32,100 32,50" fill="url(#hatch)" stroke="#000" strokeWidth="1.5" strokeLinejoin="round" />
          
          {/* d: across flats */}
          <line x1="32" y1="135" x2="118" y2="135" stroke="#000" strokeWidth="1" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
          <text x="75" y="150" fontSize="12" fontWeight="bold" fill="#000">d</text>
          <line x1="32" y1="100" x2="32" y2="140" stroke="#000" strokeWidth="0.5" />
          <line x1="118" y1="100" x2="118" y2="140" stroke="#000" strokeWidth="0.5" />
        </SvgBlueprint>
      );

    default:
      // Generic placeholder block if missed
      return (
        <SvgBlueprint>
           <rect x="25" y="25" width="100" height="100" rx="8" stroke="#000" strokeWidth="1.5" fill="none" strokeDasharray="10 5" />
           <text x="75" y="80" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#000">PROFILE</text>
        </SvgBlueprint>
      );
  }
};
