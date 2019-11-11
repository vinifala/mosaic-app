export const getAverageColour = pixels => {
  const sum = pixels.reduce(
    (acc, pixel) => {
      acc[0] += pixel[0];
      acc[1] += pixel[1];
      acc[2] += pixel[2];
      acc[3] += pixel[3];
      return acc;
    },
    [0, 0, 0, 0],
  );
  return sum.map(component => (component / pixels.length) | 0);
};
