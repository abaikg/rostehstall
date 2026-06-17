export type MaterialCode = 
  | 'steel' 
  | 'stainless' 
  | 'aluminum' 
  | 'copper' 
  | 'brass'
  | 'bronze'
  | 'lead'
  | 'cast_iron';

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
  | 'channel';

export type CalculatorMode = 'weight_by_dimensions' | 'length_by_weight';

export interface MaterialConfig {
  code: MaterialCode;
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
  product: ProductCode;
  mode: CalculatorMode;
  values: Partial<Record<InputFieldKey, number>>;
}

export type PresetSource = 'google_doc' | 'catalog';

export interface CalculatorPreset {
  id: string;
  title: string;
  productCode: ProductCode;
  materialCode: MaterialCode;
  presetValues: Partial<Record<InputFieldKey, number>>;
  weightDisplay: string;
  source: PresetSource;
  sourceRef: string;
}

export interface CalculationResult {
  value: number;
  unit: string;
  error?: string;
}

export interface ValidationError {
  key: InputFieldKey;
  message: string;
}
