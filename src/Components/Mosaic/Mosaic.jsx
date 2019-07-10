import React, { Component } from 'react';
import propTypes from 'prop-types';

import Spin from '../antd/Spin';
import MosaicCanvas from '../MosaicCanvas/MosaicCanvas';
import ShareStation from '../ShareStation';
import slices from '../../utils/slices';

const handleUpdateMosaic = (img, width, height, tileSize) => {
  const getAverageColour = pixels => {
    const sum = pixels.reduce(
      (acc, pixel) => {
        acc[0] += pixel[0];
        acc[1] += pixel[1];
        acc[2] += pixel[2];
        acc[3] += pixel[3];
        return acc;
      },
      [0, 0, 0, 0],
    );
    return sum.map(component => (component / pixels.length) | 0);
  };

  // parseImageData(arr) slices an array into arrays with length 4.
  // Therefore, the resulting data structure is an array of colour arrays
  // [[red, green, blue, alpha], ...]
  const parseImageData = slices(4);

  const canvas = document.createElement('canvas');
  const imageAspect = img.naturalHeight / img.naturalWidth;
  const canvasAspect = height / width;
  const relativeWidth =
    imageAspect < canvasAspect ? width : height / imageAspect;
  const relativeHeight =
    imageAspect > canvasAspect ? height : width * imageAspect;

  canvas.setAttribute('width', relativeWidth);
  canvas.setAttribute('height', relativeHeight);
  canvas.style.display = 'none';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  /* average by canvas resizing (sharper)
  ctx.drawImage(
    img,
    0,
    0,
    img.naturalWidth,
    img.naturalHeight,
    0,
    0,
    Math.ceil(width / tileSize),
    Math.ceil(height / tileSize),
  );

  const mosaicTiles = [];
  for (let j = 0; j < height / tileSize; j += 1) {
    for (let i = 0; i < width / tileSize; i += 1) {
      const imgData = ctx.getImageData(i, j, 1, 1);
      // const imgDataArray = parseImageData(Array.from(imgData.data));
      const averageColour = Array.from(imgData.data);

      mosaicTiles.push({
        r: averageColour[0],
        g: averageColour[1],
        b: averageColour[2],
        a: averageColour[3],
        x: i * tileSize,
        y: j * tileSize,
        s: tileSize,
      });
    }
  }
  */

  // outputs the image onto canvas
  img.crossOrigin = 'Anonymous';

  ctx.drawImage(
    img,
    0,
    0,
    img.naturalWidth,
    img.naturalHeight,
    0,
    0,
    relativeWidth,
    relativeHeight,
  );

  const mosaicTiles = [];
  for (let j = 0; j + tileSize <= relativeHeight; j += tileSize) {
    for (let i = 0; i + tileSize <= relativeWidth; i += tileSize) {
      const imgData = ctx.getImageData(i, j, tileSize, tileSize);
      const imgDataArray = parseImageData(Array.from(imgData.data));
      const averageColour = getAverageColour(imgDataArray);

      mosaicTiles.push({
        r: averageColour[0],
        g: averageColour[1],
        b: averageColour[2],
        a: averageColour[3],
        x: i,
        y: j,
        s: tileSize,
      });
    }
  }
  canvas.remove();
  return mosaicTiles;
};

class Mosaic extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mosaicTiles: [],
      statusMessage: '',
    };
  }

  mosaicCanvasReference = React.createRef();

  componentWillReceiveProps({ width, height, tileSize, img }) {
    if (img !== this.props.img) {
      this.setState({ statusMessage: 'Calculating...' });

      // React v16 (fibre) calls component render functions during idle times of the CPU thread,
      // calculating the average colour of an image is resource intensive, therefore,
      // React does not have an opportinity to update the DOM before it runs.
      // Delaying the execution of handleUpdateMosaic for a few milliseconds
      // allows react to squeeze a DOM update before calling handleUpdateMosaic.
      // This way we're able to see the status update on screen. source: https://youtu.be/ZCuYPiUIONs?t=11m44s
      setTimeout(() => {
        const mosaicTiles = handleUpdateMosaic(img, width, height, tileSize);
        this.setState({ mosaicTiles, statusMessage: '' });
      }, 20);
    }
  }

  render() {
    const { width, height, img, tileSize } = this.props;
    const { statusMessage, mosaicTiles } = this.state;

    const imageAspect = img ? img.naturalHeight / img.naturalWidth : 1;
    const canvasAspect = height / width;
    const relativeWidth =
      imageAspect < canvasAspect ? width : height / imageAspect;
    const relativeHeight =
      imageAspect > canvasAspect ? height : width * imageAspect;
    const adjustedWidth = Math.floor(relativeWidth / tileSize) * tileSize;
    const adjustedHeight = Math.floor(relativeHeight / tileSize) * tileSize;
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
            className={`mosaic__stage${
              statusMessage ? ' mosaic--loading' : ''
            }`}
            style={{
              adjustedWidth,
              adjustedHeight,
            }}
            ref={mosaicContainer => {
              this.mosaicContainer = mosaicContainer;
            }}
          >
            <MosaicCanvas
              width={adjustedWidth}
              height={adjustedHeight}
              mosaicTiles={mosaicTiles}
              id="mosaic-canvas"
              ref={this.mosaicCanvasReference}
            />
          </div>
        )}
        <ShareStation
          active={mosaicTiles.length > 0 || !statusMessage}
          canvasRef={this.mosaicCanvasReference}
        />
      </div>
    );
  }
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
