import React, { Component } from 'react';
import propTypes from 'prop-types';

import slices from '../../utils/slices';

const handleUpdateMosaic = (img, width, height, tileWidth, tileHeight) => {
  const getAverageColour = (pixels) => {
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
  // Therefore, the resulting data structure is an array of colour arrays [[red, green, blue, alpha], ...]
  const parseImageData = slices(4);

  const canvas = document.createElement('canvas');
  canvas.setAttribute('width', width);
  canvas.setAttribute('height', height);
  canvas.style.display = 'none';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  // outputs the image onto canvas
  img.crossOrigin = 'Anonymous';
  ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, 0, 0, width, height);

  const mosaicTiles = [];
  for (let j = 0; j + tileHeight <= height; j += tileHeight) {
    for (let i = 0; i + tileWidth <= width; i += tileWidth) {
      const imgData = ctx.getImageData(i, j, tileWidth, tileHeight);
      const imgDataArray = parseImageData(Array.from(imgData.data));
      const averageColour = getAverageColour(imgDataArray);

      mosaicTiles.push({
        r: averageColour[0],
        g: averageColour[1],
        b: averageColour[2],
        a: averageColour[3],
        x: i,
        y: j,
        w: tileWidth,
        h: tileHeight,
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

  componentWillReceiveProps({
    width, height, tileWidth, tileHeight, img,
  }) {
    if (img !== this.props.img) {
      this.setState({ statusMessage: 'Calculating...' });

      // React v16 (fibre) calls component render functions during idle times of the CPU thread,
      // calculating the average colour of an image is resource intensive, therefore,
      // React does not have an opportinity to update the DOM before it runs.
      // Delaying the execution of handleUpdateMosaic for a few milliseconds
      // allows react to squeeze a DOM update before calling handleUpdateMosaic.
      // This way we're able to see the status update on screen. source: https://youtu.be/ZCuYPiUIONs?t=11m44s
      setTimeout(() => {
        const mosaicTiles = handleUpdateMosaic(img, width, height, tileWidth, tileHeight);
        this.setState({ mosaicTiles, statusMessage: '' });
      }, 2);
    }
  }

  // console.log(1, state.mosaicTiles);
  render() {
    return (
      <div>
        {this.state.mosaicTiles.length < 1 && !this.props.img && <div>Please select or upload an image</div>}
        <div>{this.state.statusMessage}</div>
        {this.state.mosaicTiles.length > 0 && (
          <svg width={this.props.width} height={this.props.height}>
            {this.state.mosaicTiles.map(tile => (
              <circle
                key={`x${tile.x}y${tile.y}`}
                cx={tile.x + ((tile.w / 2) | 0)}
                cy={tile.y + ((tile.h / 2) | 0)}
                r={(tile.w + tile.h) / 4}
                fill={`rgba(${tile.r},${tile.g},${tile.b},${tile.a})`}
              />
            ))}
          </svg>
        )}
      </div>
    );
  }
}

export default Mosaic;

Mosaic.defaultProps = {
  img: null,
  width: 320,
  height: 320,
  tileWidth: 16,
  tileHeight: 16,
  mosaicTiles: [],
};

Mosaic.propTypes = {
  img: propTypes.object,
  width: propTypes.number,
  height: propTypes.number,
  tileWidth: propTypes.number,
  tileHeight: propTypes.number,
  mosaicTiles: propTypes.array,
};
