import * as React from 'react';
import propTypes from 'prop-types';

export default class MosaicCanvas extends React.Component {
  mosaicCanvas;

  handleComponentUpdate() {
    const { width, height, mosaicTiles } = this.props;
    const ctx = this.mosaicCanvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = 'white';
    ctx.fillRect(-1, -1, width + 1, height + 1);

    mosaicTiles.forEach(({ x, y, h, w, r, g, b, a }) => {
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
      ctx.beginPath();
      ctx.ellipse(
        Math.floor(x + w / 2),
        Math.floor(y + h / 2),
        Math.round(w / 2),
        Math.round(h / 2),
        0,
        0,
        2 * Math.PI,
      );
      ctx.fill('evenodd');
    });
  }

  componentDidMount() {
    const ctx = this.mosaicCanvas.getContext('2d');
    ctx.translate(0.5, 0.5);

    this.handleComponentUpdate();
  }

  componentDidUpdate() {
    this.handleComponentUpdate();
  }

  render() {
    const { height, width, id } = this.props;
    return (
      <canvas
        height={height + 1}
        width={width + 1}
        ref={mosaicCanvas => {
          this.mosaicCanvas = mosaicCanvas;
        }}
        id={id}
      />
    );
  }
}

MosaicCanvas.defaultProps = {
  height: 320,
  width: 320,
  mosaicTiles: [],
  id: 'mosaic-canvas',
};

MosaicCanvas.propTypes = {
  id: propTypes.string,
  height: propTypes.number,
  width: propTypes.number,
  mosaicTiles: propTypes.array,
};
