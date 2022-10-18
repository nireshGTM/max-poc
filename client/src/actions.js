 import { bindActionCreators } from 'redux';
 import * as user from './containers/Auth/userActions';
 import * as login from './containers/Login/actions';
 import * as project from './containers/Project/actions';
 import * as staff from './containers/Staff/actions';
 
 export default function mapDispatchToProps(dispatch) {
   return bindActionCreators(
     {
       ...user,
       ...login,
       ...project,
       ...staff
     },
     dispatch
   );
 }
 