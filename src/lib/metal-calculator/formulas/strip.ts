import { CalculationInputs } from "../types";

export const stripWeight = (v: CalculationInputs["values"], rho: number) => {
  const { width = 0, thickness = 0, length = 1 } = v;
  const area = width * thickness;
  return (area * length * rho) / 1000000;
};
