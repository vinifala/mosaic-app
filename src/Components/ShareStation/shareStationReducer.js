export const shareStationReducer = (state, { type, payload }) => {
  switch (type) {
    case 'UPLOAD_SUCCESSFUL':
      return {
        shareUrl: payload.shareUrl,
        isSharing: false,
        sharingErrorMessage: '',
      };
    case 'UPLOAD_FAILIURE':
      return {
        shareUrl: '',
        isSharing: false,
        sharingErrorMessage:
          'Sorry, something went wrong while sharing, please try again',
      };
    case 'UPLOADING':
      return {
        shareUrl: '',
        isSharing: true,
        sharingErrorMessage: '',
      };
    default:
      throw new Error();
  }
};
