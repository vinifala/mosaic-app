import React, { Component } from 'react';
import propTypes from 'prop-types';
import axios from 'axios';

import Image from '../Image/Image';

class Gallery extends Component {
  getGallery = (page = 1) => {
    this.setState({ loading: true, errorMessage: '' });
    return axios
      .get(`http://localhost:3001/gallery/${this.props.subreddit}/${page}`)
      .then((data) => {
        this.setState({
          loading: false,
          photos: data.data,
          errorMessage: '',
          page,
        });
      })
      .catch(() => this.setState({ errorMessage: 'Oops, looks like something went wrong', loading: false }));
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      photos: [],
      page: 1,
      // cache: [],
      timestamp: new Date().getTime(),
      errorMessage: '',
    };
  }

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
            minHeight: '150px',
          }}
        >
          {loading && <div>Loading...</div>}
          {errorMessage && (
            <div>
              {errorMessage}&nbsp;
              <button onClick={() => this.getGallery(this.state.page)}>Retry</button>
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
              <button onClick={() => handlePagination(page - 1)} disabled={page < 1}>
                &lt; Previous
              </button>
              <span> {page} </span>
              <button onClick={() => handlePagination(page + 1)}>Next &gt;</button>
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
