import { pageFetchReducer } from './pageFetchReducer';

describe('Page fetch reducer', () => {
  const defaultState = {
    errorMessage: '',
    loading: false,
    photos: [],
    timestamp: new Date().getTime(),
    page: 1,
  };

  describe('Handle GALLERY_INIT', () => {
    const dispatch = () =>
      pageFetchReducer(defaultState, { type: 'GALLERY_INIT' });
    const state = dispatch();

    it('should not throw', () => {
      expect(dispatch).not.toThrow();
    });
    it('should turn on loading flag', () => {
      expect(state.loading).toEqual(true);
    });
    it('should clear the error message', () => {
      expect(state.errorMessage).toEqual('');
    });
  });

  describe('Handle GALLERY_SUCCESS', () => {
    const photos = [{ url: 'https://foo.bar/baz.png' }];
    const dispatch = () =>
      pageFetchReducer(defaultState, {
        type: 'GALLERY_SUCCESS',
        payload: photos,
      });
    const state = dispatch();

    it('should not throw', () => {
      expect(dispatch).not.toThrow();
    });
    it('should turn off loading flag', () => {
      expect(state.loading).toEqual(false);
    });
    it('should clear the error message', () => {
      expect(state.errorMessage).toEqual('');
    });
    it('should update timestamp', () => {
      expect(state.timestamp).toBeGreaterThan(defaultState.timestamp);
    });
    it('should pass photos from the payload', () => {
      expect(state.photos).toEqual(photos);
    });
  });

  describe('Handle GALLERY_FAIL', () => {
    const dispatch = () =>
      pageFetchReducer(defaultState, {
        type: 'GALLERY_FAIL',
      });
    const state = dispatch();

    it('should not throw', () => {
      expect(dispatch).not.toThrow();
    });
    it('should turn off loading flag', () => {
      expect(state.loading).toEqual(false);
    });
    it('should set the error message', () => {
      expect(state.errorMessage).toEqual(
        'Oops, looks like something went wrong',
      );
    });
  });

  describe('handle invalid type', () => {
    it('should throw', () => {
      expect(() =>
        pageFetchReducer(defaultState, {
          type: 'GALLERY_ERROR',
        }),
      ).toThrow();
    });
  });
});
