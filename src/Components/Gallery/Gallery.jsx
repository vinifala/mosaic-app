import * as React from 'react';
import propTypes from 'prop-types';
import axios from 'axios';
import Spin from 'antd/lib/spin';
import 'antd/lib/spin/style/index.css';

import Button from '../antd/Button';
import Alert from '../antd/Alert';
import Image from '../Image/Image';

const pageFetchReducer = (state, action) => {
  switch (action.type) {
    case 'GALLERY_INIT':
      return {
        ...state,
        loading: true,
        errorMessage: '',
      };
    case 'GALLERY_SUCCESS':
      return {
        ...state,
        loading: false,
        timestamp: new Date().getTime(),
        errorMessage: '',
        photos: action.payload,
      };
    case 'GALLERY_FAIL':
      return {
        ...state,
        loading: false,
        errorMessage: 'Oops, looks like something went wrong',
      };
    default:
      throw new Error();
  }
};

const useFetchPages = subreddit => {
  const [page, setPage] = React.useState(1);
  const [state, dispatch] = React.useReducer(pageFetchReducer, {
    errorMessage: '',
    loading: false,
    photos: [],
    timestamp: new Date().getTime(),
    page,
  });

  React.useEffect(() => {
    const fetchPhotos = async () => {
      dispatch({ type: 'GALLERY_INIT' });

      try {
        const result = await axios.get(
          `http://localhost:3001/gallery/${subreddit}/${page}`,
        );

        dispatch({ type: 'GALLERY_SUCCESS', payload: result.data });
      } catch (error) {
        dispatch({ type: 'GALLERY_FAIL' });
      }
    };

    fetchPhotos();
  }, [page]);

  const fetchPrevPage = () => {
    setPage(page - 1);
  };

  const fetchNextPage = () => {
    setPage(page + 1);
  };

  return [{ ...state, page }, [fetchPrevPage, fetchNextPage]];
};

function Gallery(props) {
  const [
    { photos, loading, errorMessage, timestamp, page },
    [fetchPrevPage, fetchNextPage],
  ] = useFetchPages(props.subreddit);

  const getPhotoLink = ({ images, link }) => {
    // some reddit submissions are imgur galleries, in this case, we show the
    // first photo of it
    if (images && Array.isArray(images) && images.length > 0) {
      return `${images[0].link}?t=${timestamp}`;
    }

    return `${link}?t=${timestamp}`;
  };

  const currentPageCopy = `Page ${page}`;

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
            <Spin size="large" tip="loading..." />
          </div>
        )}
        {errorMessage && (
          <div>
            <Alert message={errorMessage} type="error" showIcon />
            <Button onClick={() => {}}>Retry</Button>
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
            <Image {...props} key={photo.id} src={getPhotoLink(photo)} />
          ))}
      </div>
      {!loading && !errorMessage && (
        <div>
          <Button onClick={fetchPrevPage} disabled={page < 2}>
            &lt; Previous
          </Button>
          <span>{currentPageCopy}</span>
          <Button onClick={fetchNextPage}>Next &gt;</Button>
        </div>
      )}
    </div>
  );
}

export default Gallery;

Gallery.defaultProps = {
  subreddit: 'earthporn',
};

Gallery.propTypes = {
  subreddit: propTypes.string,
};
