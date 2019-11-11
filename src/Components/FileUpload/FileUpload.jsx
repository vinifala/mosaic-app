import React from 'react';
import propTypes from 'prop-types';

import noop from '../../utils/noop';
import { toBase64 } from '../../utils/toBase64';
import Alert from '../antd/Alert';
import Image from '../Image/Image';
import { fileUploadReducer } from './fileUPloadReducer';
import { defaultState } from './defaultState';

function FileUpload() {
  const [state, dispatch] = React.useReducer(fileUploadReducer, defaultState);

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
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    const maxFileSize = 1024 * 10000;
    if (file.size > maxFileSize) {
      dispatch({
        type: 'DISPLAY_ERROR',
        payload: {
          errorMessage: 'File too large, maximum allowed size: 10Mb',
        },
      });
      return;
    }
    if (file.type.search('image') !== 0) {
      dispatch({
        type: 'DISPLAY_ERROR',
        payload: {
          errorMessage: 'File type not allowed. Only images allowed',
        },
      });
      return;
    }
    toBase64(file)
      .then(displayImage)
      .catch(handleEncodingError);
  };

  const { errorMessage, img } = state;

  return (
    <div>
      <h2>...or upload an image</h2>
      <input accept="image/*" type="file" onChange={handleFileChange} />
      {errorMessage && (
        <div>
          <Alert message={errorMessage} type="error" showIcon />
        </div>
      )}
      {img && <Image src={img} autoSelect />}
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
