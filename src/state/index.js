import propTypes from 'prop-types';
import React, { createContext, useContext, useReducer } from 'react';

import noop from '../utils/noop';

export const StateContext = createContext();
export const StateProvider = ({ reducer, initialState, children }) => (
  <StateContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </StateContext.Provider>
);
export const useStateValue = () => useContext(StateContext);

StateProvider.defaultProps = {
  reducer: noop,
  initialState: {},
  children: null,
};

StateProvider.propTypes = {
  reducer: propTypes.func,
  initialState: propTypes.object,
  children: propTypes.object,
};
