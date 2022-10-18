/*
 *
 * Project actions
 *
 */

import axios from 'axios';
import qs from 'qs';
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
import { BASE_API_URL } from '../../config';
import { setNotification } from '../Auth/userActions';
import { allFieldsValidation } from '../../utils/validation';

export const resetProjectState = () => {
  return async (dispatch, getState) => {
    return dispatch({ type: RESET_APP})
  }
};

export const projectFormChange = (name, value) => {
  let formData = {};
  formData[name] = value;

  return {
    type: PROJECT_FORM_CHANGE,
    payload: formData
  };
};

export const projectSave = (navigate,Id=null) => {
  return async (dispatch, getState) => {

    const rules = {
          project_name : 'required',
          project_head : 'required',
          category : "required",
          location : "required",
          start_date : "required",
          due_date : "required",
          description : "required"
    };

    let project = getState().project.projectFormData;
    
    var { isValid, errors } = allFieldsValidation(project, rules, {
      'required.project_name': 'Title is required.',
      'required.project_head': 'Project Head is required.',
      'required.category': 'Category is required.',
      'required.location': 'Location is required.',
      'required.start_date': 'Start Date is required.',
      'required.due_date': 'Due Date is required.',
      'required.blue_print': 'Blue Print is required.',
      'required.design': 'Image is required.',
      'required.description': 'Description is required.',
    });

    var isFileValid = true; const fileErrors = {}
    if (project.blue_print && project.blue_print.type != "application/pdf") {
      fileErrors.blue_print = ["Upload only pdf file"];
      isFileValid = false;
    }
    if (project.design && !["image/gif", "image/png", "image/jpeg", "image/jpg"].includes(project.design.type)) {
      fileErrors.design = ["Upload only image"];
      isFileValid = false;
    }
    if (!isFileValid) {
      if(errors)
      errors = {...errors, ...fileErrors}
      else
      var errors = fileErrors
    }

    if (!isValid || !isFileValid) {
      return dispatch({ type: SET_PROJECT_FORM_ERRORS, payload: errors });
    }
    dispatch({ type: SET_PROJECT_FORM_ERRORS, payload: {} });
    dispatch({ type: SET_PROJECT_SUBMITTING, payload: true });
    dispatch({ type: SET_PROJECT_LOADING, payload: true });

    var form_data = new FormData();

    for ( var key in project ) {
        form_data.append(key, project[key]);
    }

    if(Id)
    {
      await axios.put(BASE_API_URL+'/project/'+Id, form_data,{
          headers: { 
            "Content-Type": "application/x-www-form-urlencoded"
          }}).then(response => {

            dispatch(setNotification({type:"success",message:"Project Updated Successfully"}))
            dispatch(projectFormReset());
            dispatch({ type: SET_PROJECT_SUBMITTING, payload: false });
            dispatch({ type: SET_PROJECT_LOADING, payload: false });
            navigate('/project/?id='+Id)

      }).catch(error => {
        let message = (error.response.data.because) ? error.response.data.because : "something went wrong!"
        dispatch(setNotification({type: 'error', message: message, module: 'Project'}));
        dispatch({ type: SET_PROJECT_SUBMITTING, payload: false });
        dispatch({ type: SET_PROJECT_LOADING, payload: false });
      });

    }
    else
    {
      await axios.post(BASE_API_URL+'/project/create', form_data,{
          headers: { 
            "Content-Type": "application/x-www-form-urlencoded"
          }}).then(response => {

            dispatch(setNotification({type:"success",message:"Project Created Successfully"}))
            dispatch({ type: PROJECT_FORM_RESET });
            dispatch({ type: SET_PROJECT_SUBMITTING, payload: false });
            dispatch({ type: SET_PROJECT_LOADING, payload: false });
            navigate('/projects')

      }).catch(error => {
        let message = (error.response.data.because) ? error.response.data.because : "something went wrong!"
        dispatch(setNotification({type: 'error', message: message, module: 'Project'}));
        dispatch({ type: SET_PROJECT_SUBMITTING, payload: false });
        dispatch({ type: SET_PROJECT_LOADING, payload: false });
      });
    }
    
  };
};


export const getEngineers = () => {
  return async (dispatch, getState) => {
    return new Promise(async(resolve, reject) => {
      await axios.get(BASE_API_URL + '/staff/list'
        ).then(response => {
          
          if (response.data.status === true) {
            let engineers = response.data.with;
            let formData = {};
            formData['engineers'] = engineers;
            dispatch(projectChange(formData));
            return resolve(true);
          }
        }).catch(error => {
          return resolve(false);
        })
    })
  }
}

export const getCategories = () => {
  return async (dispatch, getState) => {
    return new Promise(async(resolve, reject) => {
      await axios.get(BASE_API_URL + '/category/list'
        ).then(response => {
          
          if (response.data.status === true) {
            let categories = response.data.with;            
            let formData = {};
            formData['categories'] = categories;
            dispatch(projectChange(formData));
            return resolve(true);
          }
        }).catch(error => {
          return resolve(false);
        })
    })
  }
}

export const getProjects = () => {
  return async (dispatch, getState) => {
    return new Promise(async(resolve, reject) => {
      await axios.get(BASE_API_URL + '/project/list'
        ).then(response => {
          
          if (response.data.status === true) {
            let categories = response.data.with;
            let formData = {};
            formData['projects'] = categories;
            dispatch(projectChange(formData));
            return resolve(true);
          }
        }).catch(error => {
          return resolve(false);
        })
    })
  }
}


export const projectChange = (formData) => {
  return async (dispatch, getState) => {
    return dispatch({ type: PROJECT_CHANGE, payload: formData });
  }
};

export const projectFormReset = () => {
  return async (dispatch, getState) => {
    dispatch({ type: RESET_PROJECT_SINGLE });
    return dispatch({ type: PROJECT_FORM_RESET });
  }
};

export const setProjectData = (id) => {
  return async (dispatch, getState) => {
    return new Promise(async(resolve, reject) => {
      dispatch({ type: PROJECT_FORM_RESET });
      await axios.get(BASE_API_URL + '/project/'+id
        ).then(response => {
          if (response.data.status === true) {
              let payload = {
                project_name : response.data.with.project_name,
                project_head : response.data.with.project_head._id,
                category : response.data.with.category._id,
                location : response.data.with.location,
                start_date : response.data.with.start_date,
                due_date : response.data.with.due_date,
                status : response.data.with.status,
                description : response.data.with.description
              }
              dispatch({ type: SET_PROJECT_SINGLE, payload: response.data.with });
              dispatch({ type: PROJECT_SPECIFIC_DATA, payload: payload });
              return resolve(true)
          }
        }).catch(error => {
          let message = (error.response.data.because) ? error.response.data.because : "something went wrong!"
          dispatch(setNotification({type: 'error', message: message, module: 'Project', displayFor: 5000}));
          return reject(false)
        })
        return resolve(true)
    })
  }
}

export const projectDelete = (navigate, id) => {
  return async (dispatch, getState) => {
    return new Promise(async(resolve, reject) => {
      if (confirm("Are you sure to deleting this?")) {
        await axios.delete(BASE_API_URL + '/project/'+id
        ).then(response => {
          if (response.data.status === true) {
              dispatch(setNotification({type:"success",message:"Project Deleted Successfully"}))
              dispatch(projectFormReset());
              navigate('/projects')
              return resolve(true)
          }
        }).catch(error => {
          let message = (error.response.data.because) ? error.response.data.because : "something went wrong!"
          dispatch(setNotification({type: 'error', message: message, module: 'Project', displayFor: 5000}));
          return reject(false)
        })

      } else {
        return resolve(true)
      }
    })
  }
}