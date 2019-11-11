import { fileUploadReducer } from './fileUPloadReducer';

describe('File upload component reducer', () => {
  describe('Handle DISPLAY_IMAGE', () => {
    const dispatch = state =>
      fileUploadReducer(state, {
        type: 'DISPLAY_IMAGE',
        payload: {
          img: 'foo.png',
        },
      });
    const state = dispatch();

    it('should not have thrown', () => {
      expect(dispatch).not.toThrow();
    });
    it('should pass img to the state', () => {
      expect(state.img).toEqual('foo.png');
    });
    it('should clear the error message', () => {
      expect(state.errorMessage).toEqual('');
    });
  });

  describe('Handle DISPLAY_ERROR', () => {
    const dispatch = state =>
      fileUploadReducer(state, {
        type: 'DISPLAY_ERROR',
        payload: {
          errorMessage: 'oops!',
        },
      });
    const state = dispatch();

    it('should not have thrown', () => {
      expect(dispatch).not.toThrow();
    });
    it('should clear img', () => {
      expect(state.img).toEqual('');
    });
    it('should pass the error message', () => {
      expect(state.errorMessage).toEqual('oops!');
    });
  });

  describe('Handle invalid type', () => {
    it('should throw', () => {
      expect(() =>
        fileUploadReducer(
          {},
          {
            type: 'DISPLAY_IMAGE1',
            payload: {
              img: 'foo.png',
            },
          },
        ),
      ).toThrow();
    });
  });
});
