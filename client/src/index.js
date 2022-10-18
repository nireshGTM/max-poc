import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter} from 'react-router-dom';
import { Provider } from 'react-redux';
import 'antd/dist/antd.min.css'

import setToken from './utils/token'
import store from './store';
import { SET_AUTH } from './containers/Auth/constants';

// Authentication
const token = localStorage.getItem('token');

if (token) {
  // authenticate api authorization
  setToken(token);

  // authenticate routes
  store.dispatch({ type: SET_AUTH });
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
