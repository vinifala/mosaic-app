import React from 'react';
import propTypes from 'prop-types';
import ConfigProvider from 'antd/lib/config-provider';
import enUS from 'antd/lib/locale-provider/en_US';

import Gallery from './Components/Gallery/Gallery';
import Mosaic from './Components/Mosaic/Mosaic';
import FileUpload from './Components/FileUpload/FileUpload';
import './App.css';
import { StateProvider } from './state';

function App(/* props */) {
  const reducer = (state, action) => {
    switch (action.type) {
      case 'SELECT_IMAGE':
        return {
          image: action.image,
        };

      default:
        return state;
    }
  };

  return (
    <ConfigProvider locale={enUS}>
      <StateProvider initialState={{ image: null }} reducer={reducer}>
        <div className="App">
          <div>
            <Gallery subreddit="earthporn" />
          </div>
          <div>
            <FileUpload />
          </div>
          <div>
            <Mosaic width={1000} height={600} tileSize={10} />
          </div>
        </div>
      </StateProvider>
    </ConfigProvider>
  );
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
