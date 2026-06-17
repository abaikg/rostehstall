import { CalculationInputs } from "../types";

export const angleWeight = (v: CalculationInputs["values"], rho: number) => {
  const { sideA = 0, sideB = 0, thickness = 0, length = 1 } = v;
  const area = (sideA + sideB - thickness) * thickness;
  return (area * length * rho) / 1000000;
};
