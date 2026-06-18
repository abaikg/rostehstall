import { ProductCode, CalculationInputs } from "../types";
import { getMaterialDensity } from "../config/materials";
import { sheetWeight } from "./sheet";
import { rodWeight } from "./rod";
import { squareWeight } from "./square";
import { hexWeight } from "./hex";
import { roundPipeWeight } from "./roundPipe";
import { profilePipeWeight } from "./profilePipe";
import { stripWeight } from "./strip";
import { angleWeight } from "./angle";
import { channelWeight } from "./channel";

type FormulaFn = (values: CalculationInputs["values"], density: number) => number;

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
  channel: channelWeight,
};

export const calculateWeight = (inputs: CalculationInputs): number => {
  const { product, material, grade, values } = inputs;
  const density = getMaterialDensity(material, grade);
  const formula = formulaMap[product];
  
  if (!formula) return 0;
  
  return formula(values, density);
};

export const calculateLength = (weight: number, inputs: CalculationInputs): number => {
  const unitInputs = { ...inputs, values: { ...inputs.values, length: 1 } };
  const unitWeight = calculateWeight(unitInputs);
  
  return unitWeight > 0 ? weight / unitWeight : 0;
};
