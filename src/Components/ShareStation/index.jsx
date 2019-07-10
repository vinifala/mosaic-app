import axios from 'axios';
import propTypes from 'prop-types';
import * as React from 'react';

import Alert from '../antd/Alert';
import Button from '../antd/Button';
import Spin from '../antd/Spin';
import toBase64 from '../../utils/toBase64';

const shareStationReducer = (state, { type, payload }) => {
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

const useShareMosaicOnImgur = () => {
  const [state, dispatch] = React.useReducer(shareStationReducer, {
    shareUrl: '',
    isSharing: false,
    sharingErrorMessage: '',
  });

  const handleSuccessfulUpload = ({ data }) =>
    dispatch({
      type: 'UPLOAD_SUCCESSFUL',
      payload: {
        shareUrl: data.data.link,
      },
    });

  const handleFailedUpload = () => dispatch({ type: 'UPLOAD_FAILIURE' });

  const uploadEncodedImage = encodedImage =>
    axios({
      method: 'POST',
      url: 'http://localhost:3001/image',
      data: { image: encodedImage },
    })
      .then(handleSuccessfulUpload)
      .catch(handleFailedUpload);

  const handleCanvasCreatedFromMosaic = canvas => {
    console.log('ref', canvas.current);
    dispatch({ type: 'UPLOADING' });
    canvas.current.toBlob(blob => {
      toBase64(blob).then(uploadEncodedImage);
    }, 'image/png');
  };

  const handleShareImageOnImgur = canvasRef => () =>
    handleCanvasCreatedFromMosaic(canvasRef);

  return [state, handleShareImageOnImgur];
};

function ShareStation(props) {
  const { canvasRef, active } = props;
  const [
    { shareUrl, sharingErrorMessage, isSharing },
    shareMosaic,
  ] = useShareMosaicOnImgur(canvasRef.current);

  return (
    <div>
      <Button disabled={isSharing || !active} onClick={shareMosaic(canvasRef)}>
        Share on IMGUR
      </Button>
      <div>
        {sharingErrorMessage && (
          <Alert message={sharingErrorMessage} type="error" showIcon />
        )}
        {isSharing && <Spin tip="Sharing..." />}
        {shareUrl && (
          <a href={shareUrl} target="_blank" rel="noopener noreferrer">
            {shareUrl}
          </a>
        )}
      </div>
    </div>
  );
}

export default ShareStation;

ShareStation.defaultProps = {
  canvasRef: null,
  active: false,
};

ShareStation.propTypes = {
  canvasRef: propTypes.object,
  active: propTypes.bool,
};
