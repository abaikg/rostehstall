export const roundPipeWeight = (v: any, rho: number) => {
  const { diameter = 0, thickness = 0, length = 1 } = v;
  const area = Math.PI * (diameter - thickness) * thickness;
  return (area * length * rho) / 1000000;
};
