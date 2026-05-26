export const squareWeight = (v: any, rho: number) => {
  const { sideA = 0, length = 1 } = v;
  const area = Math.pow(sideA, 2);
  return (area * length * rho) / 1000000;
};
