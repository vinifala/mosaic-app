import * as React from 'react';
import propTypes from 'prop-types';

const nudgeCanvas = ref => {
  const ctx = ref.current.getContext('2d');
  // canvas context fill method always fills a path using an anti aliasing algorithm
  // which causes the circles of the mosaic to appear blurred on their extremity
  // translating the canvas context by 0.5px on each axis makes the circles sharper
  ctx.translate(0.5, 0.5);
};

const handleComponentUpdate = (props, ref) => {
  const { width, height, mosaicTiles } = props;
  const ctx = ref.current.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = 'white';
  ctx.fillRect(-1, -1, width + 1, height + 1);

  mosaicTiles.forEach(({ x, y, s, r, g, b, a }) => {
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
    ctx.beginPath();
    ctx.ellipse(
      Math.floor(x + s / 2),
      Math.floor(y + s / 2),
      Math.round(s / 2),
      Math.round(s / 2),
      0,
      0,
      2 * Math.PI,
    );
    ctx.fill('evenodd');
  });
};

const MosaicCanvas = React.forwardRef((props, ref) => {
  React.useEffect(() => {
    nudgeCanvas(ref);
  }, []);

  React.useEffect(() => {
    handleComponentUpdate(props, ref);
  });

  const { height, width, id } = props;

  return <canvas height={height + 1} width={width + 1} ref={ref} id={id} />;
});

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

export default MosaicCanvas;
