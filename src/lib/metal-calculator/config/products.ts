import { ProductCode, ProductConfig } from "../types";

export const PRODUCTS: Record<ProductCode, ProductConfig> = {
  sheet: {
    code: "sheet",
    label: "Лист / плита",
    icon: "sheet",
    fields: [
      { key: "thickness", label: "Толщина", unit: "мм", min: 0.1, max: 500 },
      { key: "width", label: "Ширина", unit: "мм", min: 1, max: 10000 },
    ],
  },
  rod: {
    code: "rod",
    label: "Круг / пруток",
    icon: "rod",
    fields: [
      { key: "diameter", label: "Диаметр круга D", unit: "мм", min: 1, max: 1000 },
    ],
  },
  square: {
    code: "square",
    label: "Квадрат",
    icon: "square",
    fields: [
      { key: "sideA", label: "Сторона", unit: "мм", min: 1, max: 1000 },
    ],
  },
  hex: {
    code: "hex",
    label: "Шестигранник",
    icon: "hex",
    fields: [
      { key: "diameter", label: "Размер под ключ", unit: "мм", min: 1, max: 500 },
    ],
  },
  pipe_round: {
    code: "pipe_round",
    label: "Труба круглая",
    icon: "pipe-round",
    fields: [
      { key: "diameter", label: "Наружный диаметр", unit: "мм", min: 1, max: 2000 },
      { key: "thickness", label: "Толщина стенки", unit: "мм", min: 0.1, max: 100 },
    ],
  },
  pipe_profile: {
    code: "pipe_profile",
    label: "Труба профильная",
    icon: "pipe-profile",
    fields: [
      { key: "sideA", label: "Сторона A", unit: "мм", min: 1, max: 1000 },
      { key: "sideB", label: "Сторона B", unit: "мм", min: 1, max: 1000 },
      { key: "thickness", label: "Толщина стенки", unit: "мм", min: 0.1, max: 100 },
    ],
  },
  rebar: {
    code: "rebar",
    label: "Арматура",
    icon: "rebar",
    fields: [
      { key: "diameter", label: "Номинальный диаметр", unit: "мм", min: 6, max: 80 },
    ],
  },
  strip: {
    code: "strip",
    label: "Полоса",
    icon: "strip",
    fields: [
      { key: "thickness", label: "Толщина", unit: "мм", min: 0.1, max: 500 },
      { key: "width", label: "Ширина", unit: "мм", min: 1, max: 10000 },
    ],
  },
  angle: {
    code: "angle",
    label: "Уголок",
    icon: "angle",
    fields: [
      { key: "sideA", label: "Полка A", unit: "мм", min: 1, max: 500 },
      { key: "sideB", label: "Полка B", unit: "мм", min: 1, max: 500 },
      { key: "thickness", label: "Толщина", unit: "мм", min: 0.1, max: 50 },
    ],
  },
  channel: {
    code: "channel",
    label: "Швеллер",
    icon: "channel",
    fields: [
      { key: "sideA", label: "Высота", unit: "мм", min: 1, max: 1000 },
      { key: "sideB", label: "Полка", unit: "мм", min: 1, max: 500 },
      { key: "thickness", label: "Толщина стенки", unit: "мм", min: 0.1, max: 100 },
    ],
  },
  beam: {
    code: "beam",
    label: "Балка / двутавр",
    icon: "beam",
    // Размеры не вводятся — выбираются номером по ГОСТ 8239 (см. sections.ts)
    fields: [],
  },
};

export const PRODUCT_LIST = Object.values(PRODUCTS);
