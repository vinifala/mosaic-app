import React, { Component } from 'react';
import propTypes from 'prop-types';
import LocaleProvider from 'antd/lib/locale-provider';
import enUS from 'antd/lib/locale-provider/en_US';

import Gallery from './Components/Gallery/Gallery';
import Mosaic from './Components/Mosaic/Mosaic';
import FileUpload from './Components/FileUpload/FileUpload';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedImage: null,
      mosaicTiles: [],
    };
  }

  handleSelectImage = (image) => {
    this.setState({ selectedImage: image });
  };

  render() {
    const { selectedImage, mosaicTiles } = this.state;
    return (
      <LocaleProvider locale={enUS}>
        <div className="App">
          <div>
            <Gallery selectImage={this.handleSelectImage} subreddit="earthporn" />
          </div>
          <div>
            <FileUpload selectImage={this.handleSelectImage} />
          </div>
          <div>
            {
              <Mosaic
                img={selectedImage}
                width={400}
                height={400}
                tileWidth={10}
                tileHeight={10}
                mosaicTiles={mosaicTiles}
              />
            }
          </div>
        </div>
      </LocaleProvider>
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
