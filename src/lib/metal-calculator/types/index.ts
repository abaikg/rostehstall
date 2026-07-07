export type MaterialCode = 
  | 'steel' 
  | 'stainless' 
  | 'aluminum' 
  | 'copper' 
  | 'brass'
  | 'bronze'
  | 'lead'
  | 'cast_iron';

export type MaterialGradeCode =
  | 'st3'
  | 'st20'
  | 'steel_09g2s'
  | 'a500c'
  | 'aisi_304'
  | 'aisi_316'
  | 'ad31'
  | 'amg5'
  | 'm1'
  | 'ls59'
  | 'brof'
  | 's1'
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
}

export type PresetSource = 'google_doc' | 'catalog';

export interface CalculatorPreset {
  id: string;
  title: string;
  productCode: ProductCode;
  materialCode: MaterialCode;
  gradeCode?: MaterialGradeCode;
  presetValues: Partial<Record<InputFieldKey, number>>;
  weightDisplay: string;
  source: PresetSource;
  sourceRef: string;
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
