export type MaterialCode = 
  | 'steel' 
  | 'stainless' 
  | 'aluminum' 
  | 'copper' 
  | 'brass';

export type ProductCode = 
  | 'sheet' 
  | 'rod' 
  | 'square' 
  | 'hex' 
  | 'pipe_round' 
  | 'pipe_profile' 
  | 'rebar' 
  | 'strip' 
  | 'angle';

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

export interface CalculationResult {
  value: number;
  unit: string;
  error?: string;
}

export interface ValidationError {
  key: InputFieldKey;
  message: string;
}
