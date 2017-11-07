import React from 'react';
import propTypes from 'prop-types';

// TODO: create a loading state
const Mosaic = (props) => {
  console.log(1, props.mosaicTiles);
  return (
    <div>
      {props.mosaicTiles.length > 0 && (
        <svg width={props.width} height={props.height}>
          {props.mosaicTiles.map(tile => (
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
};

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
