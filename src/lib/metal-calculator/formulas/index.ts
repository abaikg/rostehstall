import { ProductCode, CalculationInputs } from "../types";
import { getMaterialDensity } from "../config/materials";
import { getSection } from "../config/sections";
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
  beam: () => 0, // только табличный расчёт по номеру (ГОСТ 8239)
};

const STEEL_DENSITY = 7850; // табличные кг/м в ГОСТ нормированы для стали

export const calculateWeight = (inputs: CalculationInputs): number => {
  const { product, material, grade, values, section } = inputs;
  const density = getMaterialDensity(material, grade);

  // Табличная позиция (двутавр/швеллер по номеру): точный вес из ГОСТ
  const sectionConfig = section ? getSection(product, section) : undefined;
  if (sectionConfig) {
    return sectionConfig.kgm * (density / STEEL_DENSITY) * (values.length || 0);
  }

  // Справочный вес позиции из каталога — авторитетнее приближённой формулы
  if (inputs.presetKgm) {
    return inputs.presetKgm * (values.length || 0);
  }
  if (inputs.presetKgsm && product === "sheet") {
    return inputs.presetKgsm * ((values.width || 0) / 1000) * (values.length || 0);
  }

  const formula = formulaMap[product];

  if (!formula) return 0;

  return formula(values, density);
};

export const calculateLength = (weight: number, inputs: CalculationInputs): number => {
  const unitInputs = { ...inputs, values: { ...inputs.values, length: 1 } };
  const unitWeight = calculateWeight(unitInputs);
  
  return unitWeight > 0 ? weight / unitWeight : 0;
};
