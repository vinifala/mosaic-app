import React, { Component } from 'react';
import propTypes from 'prop-types';
import axios from 'axios';
import nth from 'ramda/src/nth';

import Image from '../Image/Image';
import slices from '../../utils/slices';
// import noop from '../../utils/noop';

// TODO: handle pagination+
class Gallery extends Component {
  getGallery = (page = 0) =>
    axios.get(`https://api.imgur.com/3/gallery/r/${this.props.subreddit}/time/${Math.floor(page / 10)}`, {
      headers: { Authorization: 'Client-ID c25046dfd5c4b8e' },
    });

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      photos: [],
      page: 0,
      cache: [],
    };

    this.getGallery(this.state.page).then((data) => {
      const cache = slices(10)(data.data.data);
      this.setState({
        loading: false,
        photos: cache[this.state.page],
        cache,
      });
    });
  }

  handlePagination = (page) => {
    let { cache } = this.state;
    if (!cache[page]) {
      this.setState({ loading: true, photos: [] });
      this.getGallery(page).then((data) => {
        cache = cache.concat(slices(10)(data.data.data));
        this.setState({
          loading: false,
          photos: cache[page],
          cache,
          page,
        });
      });
    } else {
      this.setState({
        photos: cache[page],
        page,
      });
    }
  };

  render() {
    const { handlePagination } = this;
    const { loading, photos, page } = this.state;
    return (
      <div>
        <div>
          {loading && <div>Loading...</div>}{' '}
          {photos.length > 0 && photos.map(photo => <Image key={photo.id} src={photo.link} />)}
        </div>
        <div>
          <button onClick={() => handlePagination(page - 1)} disabled={page < 1}>
            &lt; Previous
          </button>
          <span>{page + 1}</span>
          <button onClick={() => handlePagination(page + 1)}>Next &gt;</button>
        </div>
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
