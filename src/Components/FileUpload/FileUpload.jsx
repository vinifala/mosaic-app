import * as React from 'react';
import propTypes from 'prop-types';

import Alert from '../antd/Alert';
import Spin from '../antd/Spin';
import Image from '../Image/Image';
import noop from '../../utils/noop';
import toBase64 from '../../utils/toBase64';

const fileUploadReducer = (state, { type, payload }) => {
  switch (type) {
    case 'DISPLAY_ERROR':
      return {
        isUploading: false,
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

function FileUpload(props) {
  const [state, dispatch] = React.useReducer(fileUploadReducer, {
    isUploading: false,
    errorMessage: '',
    img: '',
  });

  const displayImage = img =>
    dispatch({ type: 'DISPLAY_IMAGE', payload: { img } });

  const handleEncodingError = () =>
    dispatch({
      type: 'DISPLAY_ERROR',
      payload: {
        errorMessage:
          'Could not encode the image, please select a different one.',
      },
    });

  const handleFileChange = e => {
    if (!e.target.files[0]) {
      return;
    }
    if (e.target.files[0].size > 1024 * 10000) {
      dispatch({
        type: 'DISPLAY_ERROR',
        payload: {
          errorMessage: 'File too large, maximum allowed size: 10Mb',
        },
      });
      return;
    }
    if (e.target.files[0].type.search('image') !== 0) {
      dispatch({
        type: 'DISPLAY_ERROR',
        payload: {
          errorMessage: 'File type not allowed, only images, please',
        },
      });
      return;
    }
    toBase64(e.target.files[0])
      .then(displayImage)
      .catch(handleEncodingError);
  };

  const { uploading, errorMessage, img } = state;

  return (
    <div>
      <h2>...or upload an image</h2>
      <input
        accept="image/*"
        disabled={uploading}
        type="file"
        onChange={handleFileChange}
      />
      {uploading && (
        <div>
          <Spin tip="Sending image..." />
        </div>
      )}
      {errorMessage && (
        <div>
          <Alert message={errorMessage} type="error" showIcon />
        </div>
      )}
      {!uploading && img && <Image src={img} {...props} autoSelect />}
    </div>
  );
}

export default FileUpload;

FileUpload.defaultProps = {
  selectImage: noop,
};

FileUpload.propTypes = {
  selectImage: propTypes.func,
};
