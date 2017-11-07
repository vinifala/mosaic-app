import React, { Component } from 'react';
import propTypes from 'prop-types';

import noop from '../../utils/noop';

// TODO: refactor to pure function using recompose
// TODO: refactor to antdesign cards
class Image extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
    };
  }

  handleImageLoad = () => this.setState({ loading: false });

  render() {
    return (
      <button
        onClick={() => this.props.selectImage(this.domImage)}
        style={{ width: '20%', height: '250px', overflow: 'hidden' }}
      >
        {this.state.loading && <div>Loading...</div>}
        <img
          ref={(image) => {
            this.domImage = image;
          }}
          alt="test"
          onLoad={this.handleImageLoad}
          /* need to disable caching to avoid CORS error `${this.props.src}?${new Date().getTime()}` */
          src={this.props.src}
          crossOrigin="anoniyous"
          style={{
            width: '100%',
            display: this.state.loading ? 'none' : 'block',
            objectFit: 'cover',
            height: '100%',
          }}
        />
      </button>
    );
  }
}

export default Image;

Image.defaultProps = {
  selectImage: noop,
  src: '',
};

Image.propTypes = {
  selectImage: propTypes.func,
  src: propTypes.string,
};
