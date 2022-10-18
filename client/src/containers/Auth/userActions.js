import { SET_AUTH, CLEAR_AUTH, RESET_APP, SET_ALERT, CLEAR_ALERT } from './constants';
import {resetLoginState} from '../Login/actions';

export const setAuth = () => {
  return async (dispatch, getState) => {
    return dispatch( {type: SET_AUTH} );
  }
};

export const clearAuth = () => {
  return async (dispatch, getState) => {
    dispatch( { type: CLEAR_AUTH });
    return;
  }
};

export const setNotification = (notification) => {
  return async (dispatch, getState) => {
    return dispatch( {type: SET_ALERT, payload: notification} )
  }
};

export const clearNotification = () => {
  return async (dispatch, getState) => {
    dispatch( { type: CLEAR_ALERT });
    return;
  }
};

export const resetAuthState = () => {
  return async (dispatch, getState) => {
    return dispatch({ type: RESET_APP})
  }
};

export const resetApp = () => {
  return async (dispatch, getState) => {
    dispatch(resetLoginState())
    return;
  }
};
