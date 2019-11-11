import React from 'react';
import propTypes from 'prop-types';

import { useStateValue } from '../../state';
import Spin from '../antd/Spin';
import MosaicCanvas from '../MosaicCanvas/MosaicCanvas';
import ShareStation from '../ShareStation';
import { getMosaicTilesColour } from './getMosaicTilesColour';

function Mosaic(props) {
  const [{ image }] = useStateValue();

  if (!image) {
    return null;
  }

  let mosaicCanvasReference = React.createRef();

  const { width, height, tileSize } = props;
  const statusMessage = '';

  const imageAspect = image.naturalHeight / image.naturalWidth;
  const canvasAspect = height / width;
  const relativeWidth =
    imageAspect < canvasAspect ? width : height / imageAspect;
  const relativeHeight =
    imageAspect > canvasAspect ? height : width * imageAspect;
  const adjustedWidth = Math.floor(relativeWidth / tileSize) * tileSize;
  const adjustedHeight = Math.floor(relativeHeight / tileSize) * tileSize;
  const mosaicTiles = getMosaicTilesColour({ image, ...props });

  return (
    <div
      className="mosaic__container"
      style={{
        adjustedWidth,
        adjustedHeight,
      }}
    >
      {statusMessage && (
        <div className="mosaic__status-message">
          <Spin size="large" tip={statusMessage} />
        </div>
      )}
      {mosaicTiles.length > 0 && (
        <div
          className={`mosaic__stage${statusMessage ? ' mosaic--loading' : ''}`}
          style={{
            adjustedWidth,
            adjustedHeight,
          }}
          ref={mosaicContainer => {
            mosaicCanvasReference = mosaicContainer;
          }}
        >
          <MosaicCanvas
            width={adjustedWidth}
            height={adjustedHeight}
            mosaicTiles={mosaicTiles}
            id="mosaic-canvas"
            ref={mosaicCanvasReference}
          />
        </div>
      )}
      <ShareStation
        active={mosaicTiles.length > 0 || !statusMessage}
        canvasRef={mosaicCanvasReference}
      />
    </div>
  );
}

export default Mosaic;

Mosaic.defaultProps = {
  img: null,
  width: 320,
  height: 320,
  tileSize: 16,
  mosaicTiles: [],
};

Mosaic.propTypes = {
  img: propTypes.object,
  width: propTypes.number,
  height: propTypes.number,
  tileSize: propTypes.number,
  mosaicTiles: propTypes.array,
};
