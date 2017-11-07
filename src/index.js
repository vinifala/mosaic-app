import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

ReactDOM.render(
  <App mosaicWidth={600} mosaicHeight={400} tileWidth={20} tileHeight={20} />,
  document.getElementById('root'),
);
