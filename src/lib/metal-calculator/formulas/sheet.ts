import { CalculationInputs } from "../types";

export const sheetWeight = (v: CalculationInputs["values"], rho: number) => {
  const { thickness = 0, width = 0, length = 1 } = v;
  return (thickness * width * length * rho) / 1000000;
};
