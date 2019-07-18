import noop from './noop';

describe('No-op', () => {
  it('should return undefined, regardless of argument', () => {
    expect(noop()).toBeUndefined();
    expect(noop(1)).toBeUndefined();
  });
});
