/*
 *
 * Staff reducer
 *
 */

import {
  STAFF_CHANGE,
  STAFF_FORM_CHANGE,
  STAFF_FORM_RESET,
  SET_STAFF_LOADING,
  SET_STAFF_FORM_ERRORS,
  SET_STAFF_SUBMITTING,
  SET_STAFF_SINGLE,
  RESET_STAFF_SINGLE,
  STAFF_SPECIFIC_DATA,
  RESET_APP
} from './constants';

const initialState = {
  staffFormData: {
    engineer_name : "",
    email : ""
  },
  engineers:[],
  reloadStaff:false,
  staffSingle:{},
  formErrors: {},
  isSubmitting: false,
  isLoading: false,
  activeTab: 1
};

const defaultState = JSON.stringify(initialState);

const staffReducer = (state = initialState, action) => {
  switch (action.type) {
    case RESET_APP:
      return JSON.parse(defaultState);
    case STAFF_CHANGE:
      return {
        ...state, ...action.payload
      };
    case STAFF_FORM_CHANGE:
      return {
        ...state,
        staffFormData: { ...state.staffFormData, ...action.payload }
      };
    case SET_STAFF_FORM_ERRORS:
      return {
        ...state,
        formErrors: action.payload
      };
    case SET_STAFF_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };
    case SET_STAFF_SUBMITTING:
      return {
        ...state,
        isSubmitting: action.payload
      };
    case STAFF_FORM_RESET:
      return {
        ...state,
        staffFormData: {
          engineer_name : "",
          email : ""
        },
        formErrors: {},
        isLoading: false
      };
    case SET_STAFF_SINGLE:
      return {
        ...state,
        staffSingle: action.payload
      }
    case RESET_STAFF_SINGLE:
      return {
        ...state,
        staffSingle: {}
      }
    case STAFF_SPECIFIC_DATA:
      return {
        ...state,
        staffFormData: action.payload
      }
    default:
      return state;
  }
};

export default staffReducer;
