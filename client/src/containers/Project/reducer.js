/*
 *
 * Project reducer
 *
 */

import {
  PROJECT_CHANGE,
  PROJECT_FORM_CHANGE,
  PROJECT_FORM_RESET,
  SET_PROJECT_LOADING,
  SET_PROJECT_FORM_ERRORS,
  SET_PROJECT_SUBMITTING,
  SET_PROJECT_SINGLE,
  RESET_PROJECT_SINGLE,
  PROJECT_SPECIFIC_DATA,
  RESET_APP
} from './constants';

const initialState = {
  projectFormData: {
    project_name : "",
    project_head : "",
    category : "",
    location : "",
    start_date : "",
    due_date : "",
    blue_print : "",
    design : "",
    status : "Active",
    description : ""
  },
  engineers:[],
  categories:[],
  projects:[],
  projectSingle:{},
  formErrors: {},
  isSubmitting: false,
  isLoading: false,
  activeTab: 1
};

const defaultState = JSON.stringify(initialState);

const projectReducer = (state = initialState, action) => {
  switch (action.type) {
    case RESET_APP:
      return JSON.parse(defaultState);
    case PROJECT_CHANGE:
      return {
        ...state, ...action.payload
      };
    case PROJECT_FORM_CHANGE:
      return {
        ...state,
        projectFormData: { ...state.projectFormData, ...action.payload }
      };
    case SET_PROJECT_FORM_ERRORS:
      return {
        ...state,
        formErrors: action.payload
      };
    case SET_PROJECT_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };
    case SET_PROJECT_SUBMITTING:
      return {
        ...state,
        isSubmitting: action.payload
      };
    case PROJECT_FORM_RESET:
      return {
        ...state,
        projectFormData: {
          project_name : "",
          project_head : "",
          category : "",
          location : "",
          start_date : "",
          due_date : "",
          blue_print : "",
          design : "",
          status : "Active",
          description : ""
        },
        formErrors: {},
        isLoading: false
      };
    case SET_PROJECT_SINGLE:
      return {
        ...state,
        projectSingle: action.payload
      }
    case RESET_PROJECT_SINGLE:
      return {
        ...state,
        projectSingle: {}
      }
    case PROJECT_SPECIFIC_DATA:
      return {
        ...state,
        projectFormData: action.payload
      }
    default:
      return state;
  }
};

export default projectReducer;
