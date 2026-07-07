"use client";
import React from "react";
import { CalculationInputs, ProductCode } from "@/lib/metal-calculator/types";

interface DiagramProps {
  product: ProductCode;
  values: CalculationInputs["values"];
  compact?: boolean;
}

const fmt = (v?: number) =>
  v === undefined || Number.isNaN(v) ? "—" : v.toLocaleString("ru-RU", { maximumFractionDigits: 2 });

/* Общие стили линий: контур детали + выносные размеры */
const SHAPE = { fill: "#f3f4f6", stroke: "#9ca3af", strokeWidth: 1.5 } as const;
const HATCH_ID = "calc-hatch";
const DIM = { stroke: "#94a3b8", strokeWidth: 1 } as const;

const DimLabel = ({ x, y, children }: { x: number; y: number; children: React.ReactNode }) => (
  <text x={x} y={y} textAnchor="middle" className="fill-brand-primary" fontSize="11" fontWeight="700">
    {children}
  </text>
);

const Hatch = () => (
  <defs>
    <pattern id={HATCH_ID} width="6" height="6" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
      <line x1="0" y1="0" x2="0" y2="6" stroke="#d1d5db" strokeWidth="1.5" />
    </pattern>
  </defs>
);

/* Горизонтальная размерная линия со стрелками */
const HDim = ({ x1, x2, y, label }: { x1: number; x2: number; y: number; label: string }) => (
  <g>
    <line x1={x1} y1={y} x2={x2} y2={y} {...DIM} markerStart="url(#calc-arr-s)" markerEnd="url(#calc-arr-e)" />
    <DimLabel x={(x1 + x2) / 2} y={y - 5}>{label}</DimLabel>
  </g>
);

const VDim = ({ x, y1, y2, label }: { x: number; y1: number; y2: number; label: string }) => (
  <g>
    <line x1={x} y1={y1} x2={x} y2={y2} {...DIM} markerStart="url(#calc-arr-s)" markerEnd="url(#calc-arr-e)" />
    <DimLabel x={x} y={(y1 + y2) / 2 - 6}>{label}</DimLabel>
  </g>
);

const Arrows = () => (
  <defs>
    <marker id="calc-arr-e" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#94a3b8" />
    </marker>
    <marker id="calc-arr-s" markerWidth="8" markerHeight="8" refX="0" refY="3" orient="auto-start-reverse">
      <path d="M0,0 L6,3 L0,6 Z" fill="#94a3b8" />
    </marker>
  </defs>
);

export const ProductDiagram = ({ product, values, compact = false }: DiagramProps) => {
  const t = values.thickness;
  const a = values.sideA;
  const b = values.sideB;
  const d = values.diameter;
  const w = values.width;

  let body: React.ReactNode = null;

  switch (product) {
    case "pipe_round":
      body = (
        <>
          <circle cx="90" cy="90" r="58" fill={`url(#${HATCH_ID})`} stroke={SHAPE.stroke} strokeWidth={SHAPE.strokeWidth} />
          <circle cx="90" cy="90" r="40" fill="#fff" stroke={SHAPE.stroke} strokeWidth={SHAPE.strokeWidth} />
          <line x1="49" y1="131" x2="131" y2="49" {...DIM} markerStart="url(#calc-arr-s)" markerEnd="url(#calc-arr-e)" />
          <DimLabel x={90} y={78}>D {fmt(d)}</DimLabel>
          <line x1="123" y1="33" x2="136" y2="46" {...DIM} />
          <DimLabel x={148} y={32}>t {fmt(t)}</DimLabel>
        </>
      );
      break;
    case "pipe_profile":
      body = (
        <>
          <rect x="35" y="45" width="110" height="90" rx="8" fill={`url(#${HATCH_ID})`} stroke={SHAPE.stroke} strokeWidth={SHAPE.strokeWidth} />
          <rect x="47" y="57" width="86" height="66" rx="4" fill="#fff" stroke={SHAPE.stroke} strokeWidth={SHAPE.strokeWidth} />
          <HDim x1={35} x2={145} y={32} label={`A ${fmt(a)}`} />
          <VDim x={160} y1={45} y2={135} label={`B ${fmt(b)}`} />
          <DimLabel x={90} y={152}>t {fmt(t)}</DimLabel>
        </>
      );
      break;
    case "sheet":
    case "strip":
      body = (
        <>
          <polygon points="40,60 140,60 155,80 55,80" fill="#e5e7eb" stroke={SHAPE.stroke} strokeWidth={1.2} />
          <polygon points="40,60 55,80 55,128 40,108" fill="#d1d5db" stroke={SHAPE.stroke} strokeWidth={1.2} />
          <polygon points="55,80 155,80 155,128 55,128" fill={SHAPE.fill} stroke={SHAPE.stroke} strokeWidth={SHAPE.strokeWidth} />
          <HDim x1={55} x2={155} y={46} label={`b ${fmt(w)}`} />
          <VDim x={170} y1={80} y2={128} label="" />
          <DimLabel x={168} y={72}>t {fmt(t)}</DimLabel>
        </>
      );
      break;
    case "rod":
    case "rebar":
      body = (
        <>
          <ellipse cx="60" cy="90" rx="18" ry="38" fill="#e5e7eb" stroke={SHAPE.stroke} strokeWidth={SHAPE.strokeWidth} />
          <path d="M60 52 H130 A18 38 0 0 1 130 128 H60" fill={SHAPE.fill} stroke={SHAPE.stroke} strokeWidth={SHAPE.strokeWidth} />
          {product === "rebar" && (
            <g stroke="#9ca3af" strokeWidth="1.2">
              {[74, 88, 102, 116].map((x) => (
                <line key={x} x1={x} y1="55" x2={x - 6} y2="125" />
              ))}
            </g>
          )}
          <VDim x={36} y1={52} y2={128} label="" />
          <DimLabel x={36} y={44}>Ø {fmt(d)}</DimLabel>
        </>
      );
      break;
    case "square":
      body = (
        <>
          <rect x="50" y="50" width="80" height="80" fill={`url(#${HATCH_ID})`} stroke={SHAPE.stroke} strokeWidth={SHAPE.strokeWidth} />
          <HDim x1={50} x2={130} y={38} label={`a ${fmt(a)}`} />
          <VDim x={146} y1={50} y2={130} label="" />
        </>
      );
      break;
    case "hex":
      body = (
        <>
          <polygon
            points="90,42 131,66 131,114 90,138 49,114 49,66"
            fill={`url(#${HATCH_ID})`}
            stroke={SHAPE.stroke}
            strokeWidth={SHAPE.strokeWidth}
          />
          <HDim x1={49} x2={131} y={30} label={`S ${fmt(d)}`} />
        </>
      );
      break;
    case "angle":
      body = (
        <>
          <path d="M55 45 H79 V111 H145 V135 H55 Z" fill={`url(#${HATCH_ID})`} stroke={SHAPE.stroke} strokeWidth={SHAPE.strokeWidth} />
          <VDim x={40} y1={45} y2={135} label="" />
          <DimLabel x={40} y={38}>A {fmt(a)}</DimLabel>
          <HDim x1={55} x2={145} y={152} label={`B ${fmt(b)}`} />
          <DimLabel x={152} y={100}>t {fmt(t)}</DimLabel>
        </>
      );
      break;
    case "channel":
      body = (
        <>
          <path d="M60 45 H140 V67 H82 V113 H140 V135 H60 Z" fill={`url(#${HATCH_ID})`} stroke={SHAPE.stroke} strokeWidth={SHAPE.strokeWidth} />
          <VDim x={44} y1={45} y2={135} label="" />
          <DimLabel x={44} y={38}>h {fmt(a)}</DimLabel>
          <HDim x1={60} x2={140} y={152} label={`b ${fmt(b)}`} />
          <DimLabel x={155} y={94}>s {fmt(t)}</DimLabel>
        </>
      );
      break;
    case "beam":
      body = (
        <>
          <path
            d="M52 45 H128 V63 H97 V117 H128 V135 H52 V117 H83 V63 H52 Z"
            fill={`url(#${HATCH_ID})`}
            stroke={SHAPE.stroke}
            strokeWidth={SHAPE.strokeWidth}
          />
          <VDim x={38} y1={45} y2={135} label="" />
          <DimLabel x={38} y={38}>h {fmt(a)}</DimLabel>
          <HDim x1={52} x2={128} y={30} label={`b ${fmt(b)}`} />
          <DimLabel x={150} y={94}>s {fmt(t)}</DimLabel>
        </>
      );
      break;
    default:
      return null;
  }

  return (
    <svg
      viewBox="0 0 180 160"
      className={compact ? "h-[104px] w-[120px] shrink-0" : "h-[150px] w-[170px] shrink-0"}
      role="img"
      aria-label="Схема профиля с обозначением размеров"
    >
      <Hatch />
      <Arrows />
      {body}
    </svg>
  );
};
