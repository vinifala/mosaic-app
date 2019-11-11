import axios from 'axios';
import React from 'react';

import { convertCanvasToBlob } from '../../utils/convertCanvasToBlob';
import { toBase64 } from '../../utils/toBase64';
import { shareStationReducer } from './shareStationReducer';

export const useShareMosaicOnImgur = () => {
  const [state, dispatch] = React.useReducer(shareStationReducer, {
    shareUrl: '',
    isSharing: false,
    sharingErrorMessage: '',
  });

  const handleSuccessfulUpload = ({ data }) => {
    dispatch({
      type: 'UPLOAD_SUCCESSFUL',
      payload: {
        shareUrl: data.data.link,
      },
    });
  };

  const uploadEncodedImage = encodedImage =>
    axios.post('http://localhost:3001/image', { image: encodedImage });

  const handleCanvasCreatedFromMosaic = async canvas => {
    dispatch({ type: 'UPLOADING' });

    let blob;
    let base64EncodedImage;
    let response;
    try {
      blob = await convertCanvasToBlob(canvas, 'image/png');
      base64EncodedImage = await toBase64(blob);
      response = await uploadEncodedImage(base64EncodedImage);
      handleSuccessfulUpload(response);
    } catch (e) {
      dispatch({ type: 'UPLOAD_FAILIURE' });
    }
  };

  return [state, canvasRef => handleCanvasCreatedFromMosaic(canvasRef)];
};
