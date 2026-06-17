import { ProductCode, ProductConfig } from "../types";

export const PRODUCTS: Record<ProductCode, ProductConfig> = {
  sheet: {
    code: 'sheet',
    label: 'Лист / Плита',
    icon: '📄',
    fields: [
      { key: 'thickness', label: 'Толщина (S)', unit: 'мм', min: 0.1, max: 500 },
      { key: 'width', label: 'Ширина (W)', unit: 'мм', min: 1, max: 10000 },
    ],
  },
  rod: {
    code: 'rod',
    label: 'Круг / Пруток',
    icon: '●',
    fields: [
      { key: 'diameter', label: 'Диаметр (D)', unit: 'мм', min: 1, max: 1000 },
    ],
  },
  square: {
    code: 'square',
    label: 'Квадрат',
    icon: '■',
    fields: [
      { key: 'sideA', label: 'Сторона (A)', unit: 'мм', min: 1, max: 1000 },
    ],
  },
  hex: {
    code: 'hex',
    label: 'Шестигранник',
    icon: '⬢',
    fields: [
      { key: 'diameter', label: 'Размер (S)', unit: 'мм', min: 1, max: 500 },
    ],
  },
  pipe_round: {
    code: 'pipe_round',
    label: 'Труба круглая',
    icon: '○',
    fields: [
      { key: 'diameter', label: 'Диаметр (D)', unit: 'мм', min: 1, max: 2000 },
      { key: 'thickness', label: 'Стенка (t)', unit: 'мм', min: 0.1, max: 100 },
    ],
  },
  pipe_profile: {
    code: 'pipe_profile',
    label: 'Труба профильная',
    icon: '▭',
    fields: [
      { key: 'sideA', label: 'Сторона A', unit: 'мм', min: 1, max: 1000 },
      { key: 'sideB', label: 'Сторона B', unit: 'мм', min: 1, max: 1000 },
      { key: 'thickness', label: 'Стенка (t)', unit: 'мм', min: 0.1, max: 100 },
    ],
  },
  rebar: {
    code: 'rebar',
    label: 'Арматура',
    icon: '⛓',
    fields: [
      { key: 'diameter', label: 'Диаметр (D)', unit: 'мм', min: 6, max: 80 },
    ],
  },
  strip: {
    code: 'strip',
    label: 'Полоса',
    icon: '▬',
    fields: [
      { key: 'thickness', label: 'Толщина (S)', unit: 'мм', min: 0.1, max: 500 },
      { key: 'width', label: 'Ширина (W)', unit: 'мм', min: 1, max: 10000 },
    ],
  },
  angle: {
    code: 'angle',
    label: 'Уголок',
    icon: '∟',
    fields: [
      { key: 'sideA', label: 'Полка A', unit: 'мм', min: 1, max: 500 },
      { key: 'sideB', label: 'Полка B', unit: 'мм', min: 1, max: 500 },
      { key: 'thickness', label: 'Толщина (t)', unit: 'мм', min: 0.1, max: 50 },
    ],
  },
  channel: {
    code: 'channel',
    label: 'РЁРІРµР»Р»РµСЂ',
    icon: '⊏',
    fields: [
      { key: 'sideA', label: 'Р’С‹СЃРѕС‚Р° (h)', unit: 'РјРј', min: 1, max: 1000 },
      { key: 'sideB', label: 'РџРѕР»РєР° (b)', unit: 'РјРј', min: 1, max: 500 },
      { key: 'thickness', label: 'РЎС‚РµРЅРєР° (s)', unit: 'РјРј', min: 0.1, max: 100 },
    ],
  },
};

export const PRODUCT_LIST = Object.values(PRODUCTS);
