import axios from 'axios';
import React from 'react';

import { pageFetchReducer } from './pageFetchReducer';

export const useFetchPages = subreddit => {
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
