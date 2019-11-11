export const fileUploadReducer = (state, { type, payload }) => {
  switch (type) {
    case 'DISPLAY_ERROR':
      return {
        uploading: false,
        img: '',
        errorMessage: payload.errorMessage,
      };
    case 'DISPLAY_IMAGE':
      return {
        uploading: false,
        img: payload.img,
        errorMessage: '',
      };
    default:
      throw new Error();
  }
};
