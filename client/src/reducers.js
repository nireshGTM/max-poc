import { combineReducers } from "redux";
import userReducer from "./containers/Auth/userReducer";
import loginReducer from "./containers/Login/reducer";
import projectReducer from "./containers/Project/reducer";
import staffReducer from "./containers/Staff/reducer";

const rootReducer = combineReducers({
    user:userReducer,
    login:loginReducer,
    project:projectReducer,
    staff:staffReducer
})

export default rootReducer;