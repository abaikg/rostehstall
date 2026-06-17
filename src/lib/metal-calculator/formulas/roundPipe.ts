import { CalculationInputs } from "../types";

export const roundPipeWeight = (v: CalculationInputs["values"], rho: number) => {
  const { diameter = 0, thickness = 0, length = 1 } = v;
  const area = Math.PI * (diameter - thickness) * thickness;
  return (area * length * rho) / 1000000;
};
