import { ProductCode, CalculationInputs } from "../types";
import { MATERIALS } from "../config/materials";
import { sheetWeight } from "./sheet";
import { rodWeight } from "./rod";
import { squareWeight } from "./square";
import { hexWeight } from "./hex";
import { roundPipeWeight } from "./roundPipe";
import { profilePipeWeight } from "./profilePipe";
import { stripWeight } from "./strip";
import { angleWeight } from "./angle";

type FormulaFn = (values: any, density: number) => number;

const formulaMap: Record<ProductCode, FormulaFn> = {
  sheet: sheetWeight,
  rod: rodWeight,
  square: squareWeight,
  hex: hexWeight,
  pipe_round: roundPipeWeight,
  pipe_profile: profilePipeWeight,
  rebar: rodWeight, // Rebar uses the same formula as Rod
  strip: stripWeight,
  angle: angleWeight,
};

export const calculateWeight = (inputs: CalculationInputs): number => {
  const { product, material, values } = inputs;
  const density = MATERIALS[material].density;
  const formula = formulaMap[product];
  
  if (!formula) return 0;
  
  return formula(values, density);
};

export const calculateLength = (weight: number, inputs: CalculationInputs): number => {
  const unitInputs = { ...inputs, values: { ...inputs.values, length: 1 } };
  const unitWeight = calculateWeight(unitInputs);
  
  return unitWeight > 0 ? weight / unitWeight : 0;
};
