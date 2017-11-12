import slices from './slices';

it('should slice array in parts of length 2', () => {
  const a = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const sliced = [[1, 2], [3, 4], [5, 6], [7, 8], [9]];
  expect(slices(2)(a)).toEqual(sliced);
});

it('should return the original array inside an array', () => {
  const a = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const sliced = [[1, 2, 3, 4, 5, 6, 7, 8, 9]];
  expect(slices(10)(a)).toEqual(sliced);
});
