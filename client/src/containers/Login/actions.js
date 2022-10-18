/*
 *
 * Login actions
 *
 */

import axios from 'axios';
// import { push } from 'connected-react-router';
import {
  LOGIN_CHANGE,
  LOGIN_RESET,
  SET_LOGIN_LOADING,
  SET_LOGIN_FORM_ERRORS,
  SET_LOGIN_SUBMITTING,
  RESET_APP
} from './constants';
import { BASE_API_URL } from '../../config';
import { setAuth, clearAuth, resetApp, setNotification } from '../Auth/userActions';
import setToken from '../../utils/token';
import { allFieldsValidation } from '../../utils/validation';

export const resetLoginState = () => {
  return async (dispatch, getState) => {
    return dispatch({ type: RESET_APP})
  }
};

export const loginChange = (name, value) => {
  let formData = {};
  formData[name] = value;

  return {
    type: LOGIN_CHANGE,
    payload: formData
  };
};

export const login = (navigate) => {
  return async (dispatch, getState) => {

    const rules = {
      username: 'required|email',
      password: 'required|min:6'
    };

    let user = getState().login.loginFormData;
    
    const { isValid, errors } = allFieldsValidation(user, rules, {
      'required.username': 'Email is required.',
      'email.username': 'Email format is invalid.',
      'required.password': 'Password is required.',
      'min.password': 'Password must be at least 6 characters.'
    });

    if (!isValid) {
      return dispatch({ type: SET_LOGIN_FORM_ERRORS, payload: errors });
    }
    dispatch({ type: SET_LOGIN_FORM_ERRORS, payload: {} });
    dispatch({ type: SET_LOGIN_SUBMITTING, payload: true });
    dispatch({ type: SET_LOGIN_LOADING, payload: true });

      user = {...user, grant_type: 'password', username: user.username.toLowerCase()} 
      /* Statically set the username and password. We should remove them after completed our testing. */
      /*user = {username: 'devclient@gmail.com', password: 'dev_user_password', grant_type:'password'};*/
      // const requestOptions = {
      //     method: 'POST',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify(user)
      // };

      await axios.post(BASE_API_URL+'/api_login', user,{
        headers: { 
          "Content-Type": "application/x-www-form-urlencoded"
        }}).then(response => {
          localStorage.setItem('token', response.data.with.accessToken);
          localStorage.setItem('refreshToken', response.data.with.refreshToken);
          localStorage.setItem('email', user.username.toLowerCase());
          
          setToken(response.data.with.access_token);
          
          dispatch(setAuth());
          dispatch(setNotification({type:"success",message:"Successfully logged in"}))
          dispatch({ type: LOGIN_RESET });
    }).catch(error => {
      let message = (error.response.data.because) ? error.response.data.because : "something went wrong!"
      dispatch(setNotification({type: 'error', message: message, module: 'Login'}));
    }).finally(() => {
      dispatch({ type: SET_LOGIN_SUBMITTING, payload: false });
      dispatch({ type: SET_LOGIN_LOADING, payload: false });
    });
  };
};

export const signOut = (message = 'You have signed out!') => {
  return (dispatch, getState) => {
    dispatch(clearAuth());
    dispatch(resetApp());
    // dispatch(push('/login'));

    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('email');

    dispatch(setNotification({type: 'success', message: message, module: 'Login'}));
  };
};
