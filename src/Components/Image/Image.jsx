import * as React from 'react';
import propTypes from 'prop-types';

import Spin from '../antd/Spin';
import noop from '../../utils/noop';

const imageReducer = (state, { type }) => {
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

function Image(props) {
  const [state, dispatch] = React.useReducer(imageReducer, {
    loading: true,
    errorMessage: '',
  });

  const { loading, errorMessage } = state;
  const { selectImage, autoSelect, src } = props;
  const domImage = React.useRef(null);

  // If image does not load within 20s, dispatch timeout.
  const timeout = setTimeout(() => {
    if (loading) {
      dispatch({ type: 'IMAGE_TIMEOUT' });
    }
  }, 20000);

  const handleImageLoad = () => {
    clearTimeout(timeout);
    dispatch({ type: 'IMAGE_SUCCESS' });
    if (autoSelect) {
      selectImage(domImage.current);
    }
  };

  const handleImageError = () => {
    clearTimeout(timeout);
    dispatch({ type: 'IMAGE_ERROR' });
  };

  return (
    <button
      type="button"
      disabled={loading || errorMessage}
      onClick={() => selectImage(domImage.current)}
      style={{
        width: '10%',
        height: '150px',
        overflow: 'hidden',
        border: 0,
        padding: 0,
        cursor: !loading && !errorMessage ? 'pointer' : 'not-allowed',
      }}
    >
      {loading && (
        <span>
          <Spin />
        </span>
      )}
      {errorMessage && <span>{errorMessage}</span>}
      {!errorMessage && (
        <img
          ref={domImage}
          alt="Unable to load ='("
          onLoad={handleImageLoad}
          onError={handleImageError}
          src={src}
          crossOrigin="anonymous"
          style={{
            width: '100%',
            display: loading ? 'none' : 'block',
            objectFit: 'cover',
            height: '100%',
          }}
        />
      )}
    </button>
  );
}

export default Image;

Image.defaultProps = {
  selectImage: noop,
  autoSelect: false,
  src: '',
};

Image.propTypes = {
  selectImage: propTypes.func,
  autoSelect: propTypes.bool,
  src: propTypes.string,
};
