import slices from '../../utils/slices';
import { getAverageColour } from './getAverageColour';

export const getMosaicTilesColour = ({ image, width, height, tileSize }) => {
  // parseImageData(arr) slices an array into arrays with length 4.
  // Therefore, the resulting data structure is an array of colour arrays
  // [[red, green, blue, alpha], ...]
  const parseImageData = slices(4);

  const canvas = document.createElement('canvas');
  const imageAspect = image.naturalHeight / image.naturalWidth;
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
    image,
    0,
    0,
    image.naturalWidth,
    image.naturalHeight,
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
  image.crossOrigin = 'Anonymous';

  ctx.drawImage(
    image,
    0,
    0,
    image.naturalWidth,
    image.naturalHeight,
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
