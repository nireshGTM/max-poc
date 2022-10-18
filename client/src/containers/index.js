import { Routes, Route } from "react-router-dom";
import { connect } from 'react-redux';
import actions from '../actions';
import Header from '../components/nav/Header';
import Login from '../containers/Login'
import Home from '../containers/Home'
import Projects from '../containers/Project/'
import Project from '../containers/Project/project'
import Staff from '../containers/Staff/'

const Application = (props) => {
  return (
    <>
      <Header {...props}></Header>
      <Routes>
        <Route exact path="/" element={<Home {...props}/>}/>
        <Route exact path="/projects" element={<Projects {...props}/>}/>
        <Route exact path="/login" element={<Login {...props}/>} /> 
        <Route exact path="/project" element={<Project {...props}/>} /> 
        <Route exact path="/staff" element={<Staff {...props}/>} /> 
      </Routes>
    </>
  );
}

const mapStateToProps = state => {
    return {
      authenticated: state.user.authenticated,
      notifications: state.user.notifications
    };
  };
  
export default connect(mapStateToProps, actions)(Application)
