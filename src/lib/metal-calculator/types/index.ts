export type MaterialCode =
  | 'steel'
  | 'stainless'
  | 'aluminum'
  | 'copper'
  | 'brass'
  | 'bronze'
  | 'lead'
  | 'zinc'
  | 'cast_iron';

export type MaterialGradeCode =
  // Чёрная сталь
  | 'st3'
  | 'st10'
  | 'st20'
  | 'st35'
  | 'st45'
  | 'steel_08ps'
  | 'steel_09g2s'
  | 'a500c'
  | 'kh20'
  | 'kh40'
  | 'khgsa30'
  | 'khgsa35'
  | 'khs38'
  | 'kh1mf12'
  | 'gs15'
  // Нержавейка
  | 'aisi_201'
  | 'aisi_304'
  | 'aisi_316'
  // Алюминий и дюраль
  | 'ad31'
  | 'ad0'
  | 'a5'
  | 'amg5'
  | 'd16t'
  // Медь
  | 'm1'
  | 'm2'
  // Латунь
  | 'ls59'
  | 'l63'
  // Бронза
  | 'brof'
  | 'braj94'
  // Свинец
  | 's1'
  | 's2'
  // Цинк
  | 'zn0'
  | 'zn1'
  // Чугун
  | 'sch20';

export type ProductCode =
  | 'sheet'
  | 'rod'
  | 'square'
  | 'hex'
  | 'pipe_round'
  | 'pipe_profile'
  | 'rebar'
  | 'strip'
  | 'angle'
  | 'channel'
  | 'beam';

export type CalculatorMode = 'weight_by_dimensions' | 'length_by_weight';

export interface MaterialConfig {
  code: MaterialCode;
  name: string;
  density: number; // kg/m3
}

export interface MaterialGradeConfig {
  code: MaterialGradeCode;
  materialCode: MaterialCode;
  name: string;
  density: number; // kg/m3
}

export type InputFieldKey = 'thickness' | 'width' | 'length' | 'diameter' | 'sideA' | 'sideB' | 'weight';

export interface FieldConfig {
  key: InputFieldKey;
  label: string;
  unit: string;
  placeholder?: string;
  min?: number;
  max?: number;
}

export interface ProductConfig {
  code: ProductCode;
  label: string;
  icon: string; // Emoji or SVG path identifier
  fields: FieldConfig[];
}

export interface CalculationInputs {
  material: MaterialCode;
  grade?: MaterialGradeCode;
  product: ProductCode;
  mode: CalculatorMode;
  values: Partial<Record<InputFieldKey, number>>;
  // Номер табличной позиции по ГОСТ (двутавр/швеллер); если задан —
  // вес берётся из таблицы, а не из формулы
  section?: string;
  // Справочный вес позиции из каталога (кг/м или кг/м² для листа);
  // если задан — вес берётся из каталога, а не из формулы.
  // Сбрасывается при ручной правке размеров/материала.
  presetKgm?: number;
  presetKgsm?: number;
}

export interface CalculatorPreset {
  id: string;
  /** slug товара в каталоге — для диплинка /calculator?item=<slug> */
  slug: string;
  title: string;
  productCode: ProductCode;
  materialCode: MaterialCode;
  gradeCode?: MaterialGradeCode;
  presetValues: Partial<Record<InputFieldKey, number>>;
  /** Номер табличной позиции по ГОСТ (швеллер/двутавр) */
  sectionCode?: string;
  /** Справочный вес из каталога */
  kgm?: number;
  kgsm?: number;
  weightDisplay: string;
}

export interface CalculationResult {
  value: number;
  unit: string;
  error?: string;
  unitWeight?: number;
  length?: number;
  materialName?: string;
  gradeName?: string;
  productName?: string;
  sheetWeight?: number;
  area?: number;
  isCalculated?: boolean;
}

export interface ValidationError {
  key: InputFieldKey;
  message: string;
}
