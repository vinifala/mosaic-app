import React, { Component } from 'react';

import Gallery from './Components/Gallery/Gallery';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      subreddit: 'earthporn',
    };
  }

  render() {
    const { subreddit } = this.state;
    return (
      <div className="App">
        <Gallery subreddit={subreddit} />
      </div>
    );
  }
}

export default App;
