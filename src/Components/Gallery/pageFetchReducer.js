export const pageFetchReducer = (state, action) => {
  switch (action.type) {
    case 'GALLERY_INIT':
      return {
        ...state,
        loading: true,
        errorMessage: '',
      };
    case 'GALLERY_SUCCESS':
      return {
        ...state,
        loading: false,
        timestamp: new Date().getTime(),
        errorMessage: '',
        photos: action.payload,
      };
    case 'GALLERY_FAIL':
      return {
        ...state,
        loading: false,
        errorMessage: 'Oops, looks like something went wrong',
      };
    default:
      throw new Error();
  }
};
