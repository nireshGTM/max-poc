/*
 *
 * Login reducer
 *
 */

import {
  LOGIN_CHANGE,
  LOGIN_RESET,
  SET_LOGIN_LOADING,
  SET_LOGIN_FORM_ERRORS,
  SET_LOGIN_SUBMITTING,
  RESET_APP
} from './constants';

const initialState = {
  loginFormData: {
    username: '',
    password: ''
  },
  formErrors: {},
  isSubmitting: false,
  isLoading: false,
  activeTab: 1
};

const defaultState = JSON.stringify(initialState);

const loginReducer = (state = initialState, action) => {
  switch (action.type) {
    case RESET_APP:
      return JSON.parse(defaultState);
    case LOGIN_CHANGE:
      return {
        ...state,
        loginFormData: { ...state.loginFormData, ...action.payload }
      };
    case SET_LOGIN_FORM_ERRORS:
      return {
        ...state,
        formErrors: action.payload
      };
    case SET_LOGIN_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };
    case SET_LOGIN_SUBMITTING:
      return {
        ...state,
        isSubmitting: action.payload
      };
    case LOGIN_RESET:
      return {
        ...state,
        loginFormData: {
          username: '',
          password: ''
        },
        formErrors: {},
        isLoading: false
      };
    default:
      return state;
  }
};

export default loginReducer;
