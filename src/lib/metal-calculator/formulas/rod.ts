export const rodWeight = (v: any, rho: number) => {
  const { diameter = 0, length = 1 } = v;
  const area = (Math.PI * Math.pow(diameter, 2)) / 4;
  return (area * length * rho) / 1000000;
};
