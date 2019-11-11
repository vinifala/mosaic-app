import React from 'react';

import { useFetchPages } from './useFetchPages';

jest.mock('axios', () => ({
  get: () => Promise.resolve(),
}));
const pageMock = 2;
const stateMock = { page: pageMock };
const setMock = jest.fn();
jest
  .spyOn(React, 'useState')
  .mockImplementation(jest.fn(() => [pageMock, setMock]));
jest
  .spyOn(React, 'useReducer')
  .mockImplementation(jest.fn(() => [stateMock, jest.fn()]));
jest.spyOn(React, 'useEffect').mockImplementation(jest.fn());

afterEach(() => {
  jest.clearAllMocks();
});

describe('Use Fetch Pages custom hook', () => {
  const [, [fetchPrevPage, fetchNextPage]] = useFetchPages('earthporn');
  it('should increment page', () => {
    fetchNextPage();
    expect(setMock).toHaveBeenCalledWith(3);
  });
  it('should decrement page', () => {
    fetchPrevPage();
    expect(setMock).toHaveBeenCalledWith(1);
  });
});
