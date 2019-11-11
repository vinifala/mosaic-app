import propTypes from 'prop-types';
import React from 'react';

import Alert from '../antd/Alert';
import Button from '../antd/Button';
import Spin from '../antd/Spin';
import { useShareMosaicOnImgur } from './useShareMosaicOnImgur';

function ShareStation(props) {
  const { canvasRef, active } = props;
  const [
    { shareUrl, sharingErrorMessage, isSharing },
    shareMosaic,
  ] = useShareMosaicOnImgur();

  return (
    <div>
      <Button
        disabled={isSharing || !active}
        onClick={() => shareMosaic(canvasRef)}
      >
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
