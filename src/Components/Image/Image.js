import React, { Component } from 'react';
import propTypes from 'prop-types';

import noop from '../../utils/noop';

class Image extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      errorMessage: '',
    };
  }

  componentDidMount() {
    // If image does not load within 20s, call timeout function.
    setTimeout(this.imageTimedOut, 20000);
  }

  imageTimedOut = () => {
    if (this.state.loading) {
      this.setState({ loading: false, errorMessage: "Image timed out ='(" });
    }
  };
  handleImageLoad = () => this.setState({ loading: false });

  render() {
    return (
      <button
        disabled={this.state.loading || this.state.errorMessage}
        onClick={() => this.props.selectImage(this.domImage)}
        style={{
          width: '10%',
          height: '150px',
          overflow: 'hidden',
          border: 0,
          padding: 0,
          cursor: !this.state.loading && !this.state.errorMessage ? 'pointer' : 'not-allowed',
        }}
      >
        {this.state.loading && <span>Loading...</span>}
        {this.state.errorMessage && <span>{this.state.errorMessage}</span>}
        {!this.state.errorMessage && (
          <img
            ref={(image) => {
              this.domImage = image;
            }}
            alt="Unable to load ='("
            onLoad={() => {
              this.handleImageLoad();
              if (this.props.autoSelect) {
                this.props.selectImage(this.domImage);
              }
            }}
            onError={() =>
              this.setState({ loading: false, errorMessage: 'Oops, we were not able to load this image.' })}
            src={this.props.src}
            crossOrigin="anonymous"
            style={{
              width: '100%',
              display: this.state.loading ? 'none' : 'block',
              objectFit: 'cover',
              height: '100%',
            }}
          />
        )}
      </button>
    );
  }
}

export default Image;

Image.defaultProps = {
  selectImage: noop,
  autoSelect: false,
  src: '',
};

Image.propTypes = {
  selectImage: propTypes.func,
  autoSelect: propTypes.bool,
  src: propTypes.string,
};
