export const profilePipeWeight = (v: any, rho: number) => {
  const { sideA = 0, sideB = 0, thickness = 0, length = 1 } = v;
  const area = (sideA * sideB) - (sideA - 2 * thickness) * (sideB - 2 * thickness);
  return (area * length * rho) / 1000000;
};
