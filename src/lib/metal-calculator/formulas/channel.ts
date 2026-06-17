import { CalculationInputs } from "../types";

export const channelWeight = (v: CalculationInputs["values"], rho: number) => {
  const { sideA = 0, sideB = 0, thickness = 0, length = 1 } = v;

  // Approximation for standard channels based on height, flange width and wall thickness.
  const area = thickness * (sideA + 3 * sideB);
  return (area * length * rho) / 1000000;
};
