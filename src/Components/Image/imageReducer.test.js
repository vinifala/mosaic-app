import { imageReducer } from './imageReducer';

describe('Image reducer', () => {
  describe('Handle IMAGE_SUCCESS', () => {
    const dispatch = () =>
      imageReducer(
        {},
        {
          type: 'IMAGE_SUCCESS',
        },
      );
    const state = dispatch();
    it('should not throw', () => {
      expect(dispatch).not.toThrow();
    });
    it('should clear the error message', () => {
      expect(state.errorMessage).toEqual('');
    });
    it('should turn off the loading flag', () => {
      expect(state.loading).toEqual(false);
    });
  });

  describe('Handle IMAGE_TIMEOUT', () => {
    const dispatch = () =>
      imageReducer(
        {},
        {
          type: 'IMAGE_TIMEOUT',
        },
      );
    const state = dispatch();
    it('should not throw', () => {
      expect(dispatch).not.toThrow();
    });
    it('should set the error message', () => {
      expect(state.errorMessage).toEqual("Image timed out ='(");
    });
    it('should turn off the loading flag', () => {
      expect(state.loading).toEqual(false);
    });
  });

  describe('Handle IMAGE_ERROR', () => {
    const dispatch = () =>
      imageReducer(
        {},
        {
          type: 'IMAGE_ERROR',
        },
      );
    const state = dispatch();
    it('should not throw', () => {
      expect(dispatch).not.toThrow();
    });
    it('should set the error message', () => {
      expect(state.errorMessage).toEqual(
        'Oops, we were not able to load this image.',
      );
    });
    it('should turn off the loading flag', () => {
      expect(state.loading).toEqual(false);
    });
  });

  describe('Handle invalid type', () => {
    expect(() => imageReducer({}, { type: 'INVALID' }));
  });
});
