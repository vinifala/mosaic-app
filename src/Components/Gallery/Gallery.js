import React, { Component } from 'react';
import propTypes from 'prop-types';
import axios from 'axios';
import Spin from 'antd/lib/spin';
import 'antd/lib/spin/style/index.css';

import Button from '../antd/Button';
import Alert from '../antd/Alert';
import Image from '../Image/Image';

class Gallery extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      photos: [],
      page: 1,
      timestamp: new Date().getTime(),
      errorMessage: '',
    };
  }

  handleGalleryRetrieval = page => data =>
    this.setState({
      loading: false,
      photos: data.data,
      errorMessage: '',
      page,
    });

  handleGalleryError = () => this.setState({ errorMessage: 'Oops, looks like something went wrong', loading: false });

  getGallery = (page = 1) => {
    this.setState({ loading: true, errorMessage: '' });
    axios
      .get(`http://localhost:3001/gallery/${this.props.subreddit}/${page}`)
      .then(this.handleGalleryRetrieval(page))
      .catch(this.handleGalleryError);
  };

  componentDidMount() {
    this.getGallery(this.state.page);
  }

  handlePagination = (page) => {
    this.getGallery(page);
  };

  render() {
    const { handlePagination } = this;
    const {
      loading, photos, page, errorMessage,
    } = this.state;
    return (
      <div>
        {!loading && !errorMessage && <h2>Plese select an image</h2>}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignContent: 'center',
            placeContent: 'center',
            height: '150px',
          }}
        >
          {loading && (
            <div>
              <Spin size="large" tip={this.state.statusMessage} />
            </div>
          )}
          {errorMessage && (
            <div>
              <Alert message={errorMessage} type="error" showIcon />
              <Button onClick={() => this.getGallery(this.state.page)}>Retry</Button>
            </div>
          )}
          {photos.length > 0 &&
            !loading &&
            photos.map(photo => (
              /*
                Loading the image from browser cache onto the canvas causes the canvas to be tainted:
                `Failed to execute 'getImageData' on 'CanvasRenderingContext2D':
                The canvas has been tainted by cross-origin data`
                including a timestamp as a query string when requesting the image forces the browser
                to download the image every time.
              */
              <Image {...this.props} key={photo.id} src={`${photo.link}?t=${this.state.timestamp}`} />
            ))}
        </div>
        {!loading &&
          !errorMessage && (
            <div>
              <Button onClick={() => handlePagination(page - 1)} disabled={page < 2}>
                &lt; Previous
              </Button>
              <span> Page {page} </span>
              <Button onClick={() => handlePagination(page + 1)}>Next &gt;</Button>
            </div>
          )}
      </div>
    );
  }
}

export default Gallery;

Gallery.defaultProps = {
  subreddit: 'earthporn',
};

Gallery.propTypes = {
  subreddit: propTypes.string,
};
