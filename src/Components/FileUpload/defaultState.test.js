import { defaultState } from './defaultState';

describe("File upload component's default state", () => {
  it('should match snapshot', () => {
    expect(defaultState).toMatchSnapshot();
  });
});
