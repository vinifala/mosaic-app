import React, { Component } from 'react';
import propTypes from 'prop-types';

import Gallery from './Components/Gallery/Gallery';
import Mosaic from './Components/Mosaic/Mosaic';
import FileUpload from './Components/FileUpload/FileUpload';
import slices from './utils/slices';
import './App.css';

// TODO: handle pagination in URL
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedImage: null,
      mosaicTiles: [],
      status: 'ready',
    };
  }

  // TODO: refactor to a mosaic container
  handleSelectImage = async (image) => {
    // this.setState({});
    console.log(this.state.status);
    const {
      mosaicWidth, mosaicHeight, tileWidth, tileHeight,
    } = this.props;
    this.setState({ selectedImage: image, status: 'Calculating...' });
    console.log(new Date().getTime());
    console.log(this.state.status);
    const mosaicTiles = await this.handleUpdateMosaic(image, mosaicWidth, mosaicHeight, tileWidth, tileHeight);
    console.log(new Date().getTime());
    this.setState({ mosaicTiles, status: 'done' });
  };

  handleUpdateMosaic = async (img, width, height, tileWidth, tileHeight) => {
    console.log('handleUpdateMosaic with', img);
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

    const parseImageData = slices(4);

    const canvas = document.createElement('canvas');
    canvas.setAttribute('width', width);
    canvas.setAttribute('height', height);
    canvas.style.display = 'none';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    // outputs the image onto canvas
    // TODO: apply aspect ratio correction
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
    // this.setState({ mosaicTiles, status: 'done' });
  };

  render() {
    const { selectedImage, status, mosaicTiles } = this.state;
    const {
      mosaicWidth, mosaicHeight, tileWidth, tileHeight,
    } = this.props;
    return (
      <div className="App">
        <div>
          <Gallery selectImage={this.handleSelectImage} subreddit="earthporn" />
        </div>
        <div>{status}</div>
        {selectedImage && mosaicTiles.length < 1 && <div>Generating mosaic...</div>}
        <div>
          {
            <Mosaic
              img={this.state.image}
              width={mosaicWidth}
              height={mosaicHeight}
              tileWidth={tileWidth}
              tileHeight={tileHeight}
              mosaicTiles={this.state.mosaicTiles}
            />
          }
        </div>
        <div>
          <FileUpload selectImage={this.handleSelectImage} />
        </div>
      </div>
    );
  }
}

export default App;

App.defaultProps = {
  mosaicWidth: 320,
  mosaicHeight: 320,
  tileWidth: 16,
  tileHeight: 16,
};

App.propTypes = {
  mosaicWidth: propTypes.number,
  mosaicHeight: propTypes.number,
  tileWidth: propTypes.number,
  tileHeight: propTypes.number,
};
