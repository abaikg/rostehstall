export const hexWeight = (v: any, rho: number) => {
  const { diameter = 0, length = 1 } = v;
  const area = (Math.sqrt(3) / 2) * Math.pow(diameter, 2);
  return (area * length * rho) / 1000000;
};
