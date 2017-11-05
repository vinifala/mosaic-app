import React, { Component } from 'react';

import Gallery from './Components/Gallery/Gallery';
import Canvas from './Components/Canvas/Canvas';
import './App.css';

// TODO: handle pagination in URL
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedImage: null,
    };
  }

  handleSelectImage = (image) => {
    console.log('handleSelectImage', image);
    this.setState({ selectedImage: image });
  };

  render() {
    const { selectedImage } = this.state;
    return (
      <div className="App">
        <div>
          <Gallery selectImage={this.handleSelectImage} subreddit="earthporn" />
        </div>
        <div>{selectedImage && <Canvas img={selectedImage} />}</div>
      </div>
    );
  }
}

export default App;
