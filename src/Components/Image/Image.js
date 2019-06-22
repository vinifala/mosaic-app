import React, { Component } from 'react';
import propTypes from 'prop-types';

import Spin from '../antd/Spin';
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
    const { loading } = this.state;
    if (loading) {
      this.setState({ loading: false, errorMessage: "Image timed out ='(" });
    }
  };

  handleImageLoad = () => this.setState({ loading: false });

  render() {
    const { loading, errorMessage } = this.state;
    const { selectImage, autoSelect, src } = this.props;
    return (
      <button
        type="button"
        disabled={loading || errorMessage}
        onClick={() => selectImage(this.domImage)}
        style={{
          width: '10%',
          height: '150px',
          overflow: 'hidden',
          border: 0,
          padding: 0,
          cursor: !loading && !errorMessage ? 'pointer' : 'not-allowed',
        }}
      >
        {loading && (
          <span>
            <Spin />
          </span>
        )}
        {errorMessage && <span>{errorMessage}</span>}
        {!errorMessage && (
          <img
            ref={image => {
              this.domImage = image;
            }}
            alt="Unable to load ='("
            onLoad={() => {
              this.handleImageLoad();
              if (autoSelect) {
                selectImage(this.domImage);
              }
            }}
            onError={() =>
              this.setState({
                loading: false,
                errorMessage: 'Oops, we were not able to load this image.',
              })
            }
            src={src}
            crossOrigin="anonymous"
            style={{
              width: '100%',
              display: loading ? 'none' : 'block',
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
