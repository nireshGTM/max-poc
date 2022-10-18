/*
 *
 * Staff actions
 *
 */

import axios from 'axios';
import qs from 'qs';
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
import { BASE_API_URL } from '../../config';
import { setNotification } from '../Auth/userActions';
import { allFieldsValidation } from '../../utils/validation';

export const resetStaffState = () => {
  return async (dispatch, getState) => {
    return dispatch({ type: RESET_APP })
  }
};

export const staffFormChange = (name, value) => {
  let formData = {};
  formData[name] = value;

  return {
    type: STAFF_FORM_CHANGE,
    payload: formData
  };
};

export const staffSave = (navigate, Id = null) => {
  return async (dispatch, getState) => {

    const rules = {
      engineer_name: 'required',
      email: 'required|email',
    };

    let staff = getState().staff.staffFormData;

    var { isValid, errors } = allFieldsValidation(staff, rules, {
      'required.engineer_name': 'Staff Name is required.',
      'required.email': 'Email is required.',
      'email.email': 'Enter a valid email.'
    });

    if (!isValid) {
      return dispatch({ type: SET_STAFF_FORM_ERRORS, payload: errors });
    }
    dispatch({ type: SET_STAFF_FORM_ERRORS, payload: {} });
    dispatch({ type: SET_STAFF_SUBMITTING, payload: true });
    dispatch({ type: SET_STAFF_LOADING, payload: true });

    var form_data = new FormData();

    for (var key in staff) {
      form_data.append(key, staff[key]);
    }

    if (Id) {
      await axios.put(BASE_API_URL + '/staff/' + Id, form_data, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }).then(response => {

        dispatch(setNotification({ type: "success", message: "Staff Updated Successfully" }))
        dispatch(staffFormReset());
        dispatch({ type: SET_STAFF_SUBMITTING, payload: false });
        dispatch({ type: SET_STAFF_LOADING, payload: false });
        dispatch(setReload(true))
        navigate('/staff')

      }).catch(error => {
        let message = (error.response.data.because) ? error.response.data.because : "something went wrong!"
        dispatch(setNotification({ type: 'error', message: message, module: 'Staff' }));
        dispatch({ type: SET_STAFF_SUBMITTING, payload: false });
        dispatch({ type: SET_STAFF_LOADING, payload: false });
      });

    }
    else {
      await axios.post(BASE_API_URL + '/staff/create', form_data, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }).then(response => {

        dispatch(setNotification({ type: "success", message: "Staff Created Successfully" }))
        dispatch({ type: STAFF_FORM_RESET });
        dispatch({ type: SET_STAFF_SUBMITTING, payload: false });
        dispatch({ type: SET_STAFF_LOADING, payload: false });
        dispatch(setReload(true))
        navigate('/staff')

      }).catch(error => {
        let message = (error.response.data.because) ? error.response.data.because : "something went wrong!"
        dispatch(setNotification({ type: 'error', message: message, module: 'Staff' }));
        dispatch({ type: SET_STAFF_SUBMITTING, payload: false });
        dispatch({ type: SET_STAFF_LOADING, payload: false });
      });
    }

  };
};

export const setReload = (value) => {
  return async (dispatch, getState) => {
    return dispatch(staffChange({reloadStaff:value}));
  }
};
export const staffChange = (formData) => {
  return async (dispatch, getState) => {
    return dispatch({ type: STAFF_CHANGE, payload: formData });
  }
};

export const staffFormReset = () => {
  return async (dispatch, getState) => {
    dispatch({ type: RESET_STAFF_SINGLE });
    return dispatch({ type: STAFF_FORM_RESET });
  }
};

export const setStaffData = (id) => {
  return async (dispatch, getState) => {
    return new Promise(async(resolve, reject) => {
      dispatch({ type: STAFF_FORM_RESET });
      await axios.get(BASE_API_URL + '/staff/'+id
        ).then(response => {
          if (response.data.status === true) {
              let payload = {
                engineer_name : response.data.with.engineer_name,
                email : response.data.with.email
              }
              dispatch({ type: SET_STAFF_SINGLE, payload: response.data.with });
              dispatch({ type: STAFF_SPECIFIC_DATA, payload: payload });
              return resolve(true)
          }
        }).catch(error => {
          let message = (error.response.data.because) ? error.response.data.because : "something went wrong!"
          dispatch(setNotification({type: 'error', message: message, module: 'Staff', displayFor: 5000}));
          return reject(false)
        })
        return resolve(true)
    })
  }
}

export const staffDelete = (navigate, id) => {
  return async (dispatch, getState) => {
    return new Promise(async(resolve, reject) => {
      if (confirm("Are you sure to deleting this?")) {
        await axios.delete(BASE_API_URL + '/staff/'+id
        ).then(response => {
              dispatch(setReload(true))
          if (response.data.status === true) {
              dispatch(setNotification({type:"success",message:"Staff Deleted Successfully"}))
              dispatch(projectFormReset());
              navigate('/staff')
              return resolve(true)
          }
        }).catch(error => {
          let message = (error.response.data.because) ? error.response.data.because : "something went wrong!"
          dispatch(setNotification({type: 'error', message: message, module: 'Staff', displayFor: 5000}));
          return reject(false)
        })

      } else {
        return resolve(true)
      }
    })
  }
}