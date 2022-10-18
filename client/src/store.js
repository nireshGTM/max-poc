/**
 *
 * store.js
 * store configuration
 */

import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import rootReducer from './reducers';

const middlewares = [thunk];

const enhancers = [applyMiddleware(...middlewares)];

// If Redux DevTools Extension is installed use it, otherwise use Redux compose
const composeEnhancers =
  process.env.NODE_ENV !== 'production' &&
  typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
    : compose;

const store = createStore(
  rootReducer,
  composeEnhancers(...enhancers)
);


export default store;
