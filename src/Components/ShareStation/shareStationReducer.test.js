import { shareStationReducer } from './shareStationReducer';

describe('Share station reducer', () => {
  describe('handle UPLOAD_SUCCESSFUL', () => {
    const dispatch = () =>
      shareStationReducer(
        {},
        {
          type: 'UPLOAD_SUCCESSFUL',
          payload: {
            shareUrl: 'https://foo.bar/baz.png',
          },
        },
      );
    const state = dispatch();
    it('should not throw', () => {
      expect(dispatch).not.toThrow();
    });
    it('should turn off sharing flag', () => {
      expect(state.isSharing).toEqual(false);
    });
    it('should clear error message', () => {
      expect(state.sharingErrorMessage).toEqual('');
    });
    it('should pass the shared url', () => {
      expect(state.shareUrl).toEqual('https://foo.bar/baz.png');
    });
  });

  describe('handle UPLOAD_FAILIURE', () => {
    const dispatch = () =>
      shareStationReducer(
        {},
        {
          type: 'UPLOAD_FAILIURE',
        },
      );
    const state = dispatch();
    it('should not throw', () => {
      expect(dispatch).not.toThrow();
    });
    it('should turn off sharing flag', () => {
      expect(state.isSharing).toEqual(false);
    });
    it('should set the error message', () => {
      expect(state.sharingErrorMessage).toEqual(
        'Sorry, something went wrong while sharing, please try again',
      );
    });
    it('should clear the shared url', () => {
      expect(state.shareUrl).toEqual('');
    });
  });
  describe('handle UPLOADING', () => {
    const dispatch = () =>
      shareStationReducer(
        {},
        {
          type: 'UPLOADING',
        },
      );
    const state = dispatch();
    it('should not throw', () => {
      expect(dispatch).not.toThrow();
    });
    it('should turn on sharing flag', () => {
      expect(state.isSharing).toEqual(true);
    });
    it('should clear error message', () => {
      expect(state.sharingErrorMessage).toEqual('');
    });
    it('should clear the shared url', () => {
      expect(state.shareUrl).toEqual('');
    });
  });
});
