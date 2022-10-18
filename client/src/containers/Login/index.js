import React, { useState, useEffect } from "react";
import { Button } from "antd";
import { MailOutlined } from "@ant-design/icons";
import { useNavigate, } from "react-router-dom";
import { connect } from 'react-redux';
import actions from '../../actions';
import Notification from "../../components/Notification";
import FormError from "../../components/FormError";


const Login = (props) => {

  const { authenticated, loginFormData, loginChange, login, formErrors, isLoading, isSubmitting } = props;
  let navigate = useNavigate();
  

  useEffect(() => {
    if (authenticated) navigate('/');
  }, [authenticated]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login();
  };

  const loginForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          type="email"
          className="form-control"
          name="username"
          value={loginFormData.username}  onChange={e => loginChange(e.target.name, e.target.value)}
          placeholder="Your email"
          autoFocus
        />
        <FormError formErrors={formErrors} element="username"/>
      </div>

      <div className="form-group">
        <input
          type="password"
          className="ant-input"
          name="password"
          value={loginFormData.password} onChange={e => loginChange(e.target.name, e.target.value)}
          placeholder="Your password"
          autoComplete="on"
        />
        <FormError formErrors={formErrors} element="password"/>
      </div>

      <br />
      <Button
        onClick={handleSubmit}
        type="primary"
        className="mb-3"
        block
        shape="round"
        icon={<MailOutlined />}
        size="large"
        disabled={!loginFormData.username || loginFormData.password.length < 6}
      >
        Login with Email/Password
      </Button>
    </form>
  );

  return (
    <div className="container p-5">
      <Notification {...props}/>
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h4>Login</h4>
          {loginForm()}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    loginFormData: state.login.loginFormData,
    formErrors: state.login.formErrors,
    isLoading: state.login.isLoading,
    isSubmitting: state.login.isSubmitting
  };
};

export default connect(mapStateToProps, actions) (Login);
