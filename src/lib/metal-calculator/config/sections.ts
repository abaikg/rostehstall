import { ProductCode } from "../types";

// Табличные позиции сортового проката по ГОСТ: вес берётся из стандарта
// (кг/м для стали 7850 кг/м³), а не из приближённой формулы.
export interface SectionConfig {
  code: string;      // "20" (двутавр), "10У" (швеллер)
  label: string;     // подпись в селекте
  h: number;         // высота, мм
  b: number;         // ширина полки, мм
  s: number;         // толщина стенки, мм
  t: number;         // средняя толщина полки, мм
  kgm: number;       // теоретическая масса 1 м, кг (ГОСТ)
}

// ГОСТ 8239-89 — двутавры стальные горячекатаные с уклоном граней полок
export const BEAM_SECTIONS: SectionConfig[] = [
  { code: "10", label: "№10", h: 100, b: 55, s: 4.5, t: 7.2, kgm: 9.46 },
  { code: "12", label: "№12", h: 120, b: 64, s: 4.8, t: 7.3, kgm: 11.5 },
  { code: "14", label: "№14", h: 140, b: 73, s: 4.9, t: 7.5, kgm: 13.7 },
  { code: "16", label: "№16", h: 160, b: 81, s: 5.0, t: 7.8, kgm: 15.9 },
  { code: "18", label: "№18", h: 180, b: 90, s: 5.1, t: 8.1, kgm: 18.4 },
  { code: "20", label: "№20", h: 200, b: 100, s: 5.2, t: 8.4, kgm: 21.0 },
  { code: "22", label: "№22", h: 220, b: 110, s: 5.4, t: 8.7, kgm: 24.0 },
  { code: "24", label: "№24", h: 240, b: 115, s: 5.6, t: 9.5, kgm: 27.3 },
  { code: "27", label: "№27", h: 270, b: 125, s: 6.0, t: 9.8, kgm: 31.5 },
  { code: "30", label: "№30", h: 300, b: 135, s: 6.5, t: 10.2, kgm: 36.5 },
  { code: "33", label: "№33", h: 330, b: 140, s: 7.0, t: 11.2, kgm: 42.2 },
  { code: "36", label: "№36", h: 360, b: 145, s: 7.5, t: 12.3, kgm: 48.6 },
  { code: "40", label: "№40", h: 400, b: 155, s: 8.3, t: 13.0, kgm: 57.0 },
  { code: "45", label: "№45", h: 450, b: 160, s: 9.0, t: 14.2, kgm: 66.5 },
  { code: "50", label: "№50", h: 500, b: 170, s: 10.0, t: 15.2, kgm: 78.5 },
  { code: "55", label: "№55", h: 550, b: 180, s: 11.0, t: 16.5, kgm: 92.6 },
  { code: "60", label: "№60", h: 600, b: 190, s: 12.0, t: 17.8, kgm: 108 },
];

// ГОСТ 8240-97 — швеллеры стальные горячекатаные, серия У (с уклоном граней)
export const CHANNEL_SECTIONS: SectionConfig[] = [
  { code: "5У", label: "№5У", h: 50, b: 32, s: 4.4, t: 7.0, kgm: 4.84 },
  { code: "6.5У", label: "№6,5У", h: 65, b: 36, s: 4.4, t: 7.2, kgm: 5.9 },
  { code: "8У", label: "№8У", h: 80, b: 40, s: 4.5, t: 7.4, kgm: 7.05 },
  { code: "10У", label: "№10У", h: 100, b: 46, s: 4.5, t: 7.6, kgm: 8.59 },
  { code: "12У", label: "№12У", h: 120, b: 52, s: 4.8, t: 7.8, kgm: 10.4 },
  { code: "14У", label: "№14У", h: 140, b: 58, s: 4.9, t: 8.1, kgm: 12.3 },
  { code: "16У", label: "№16У", h: 160, b: 64, s: 5.0, t: 8.4, kgm: 14.2 },
  { code: "18У", label: "№18У", h: 180, b: 70, s: 5.1, t: 8.7, kgm: 16.3 },
  { code: "20У", label: "№20У", h: 200, b: 76, s: 5.2, t: 9.0, kgm: 18.4 },
  { code: "22У", label: "№22У", h: 220, b: 82, s: 5.4, t: 9.5, kgm: 21.0 },
  { code: "24У", label: "№24У", h: 240, b: 90, s: 5.6, t: 10.0, kgm: 24.0 },
  { code: "27У", label: "№27У", h: 270, b: 95, s: 6.0, t: 10.5, kgm: 27.7 },
  { code: "30У", label: "№30У", h: 300, b: 100, s: 6.5, t: 11.0, kgm: 31.8 },
];

export const SECTION_TABLES: Partial<Record<ProductCode, SectionConfig[]>> = {
  beam: BEAM_SECTIONS,
  channel: CHANNEL_SECTIONS,
};

export const getSections = (product: ProductCode): SectionConfig[] =>
  SECTION_TABLES[product] ?? [];

export const getSection = (product: ProductCode, code: string): SectionConfig | undefined =>
  getSections(product).find((section) => section.code === code);

// Табличный прокат нормирован для стали — для цветных металлов не показываем
export const isSectionProduct = (product: ProductCode): boolean =>
  Boolean(SECTION_TABLES[product]?.length);
