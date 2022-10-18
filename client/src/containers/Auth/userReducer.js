
import { SET_AUTH, CLEAR_AUTH, RESET_APP, SET_ALERT, CLEAR_ALERT } from './constants';
const initialState = {
    authenticated: false,
    notifications: []
  };
  
  const defaultState = JSON.stringify(initialState);
  
  const userReducer = (state = initialState, action) => {
    switch (action.type) {
      case RESET_APP:
        return JSON.parse(defaultState);
      case SET_AUTH:
        return {
          ...state,
          authenticated: true
        };
      case CLEAR_AUTH:
        return {
          ...state,
          authenticated: false
        };
      case SET_ALERT:
        return {
          ...state,
          notifications: [...state.notifications, action.payload]
        };
      case CLEAR_ALERT:
        return {
          ...state,
          notifications: []
        };
      default:
        return state;
    }
  };
  
  export default userReducer;