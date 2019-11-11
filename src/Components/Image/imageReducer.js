export const imageReducer = (_, { type }) => {
  switch (type) {
    case 'IMAGE_SUCCESS':
      return { loading: false, errorMessage: '' };
    case 'IMAGE_TIMEOUT':
      return { loading: false, errorMessage: "Image timed out ='(" };
    case 'IMAGE_ERROR':
      return {
        loading: false,
        errorMessage: 'Oops, we were not able to load this image.',
      };
    default:
      throw new Error();
  }
};
