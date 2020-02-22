import {myStompClientReducer} from './stompclientreducer'
import {combineReducers} from "redux";
import {myUserReducer} from "./userreducers";
const customRootReducer = combineReducers({
    stmpCltReducer: myStompClientReducer,
    myUserReducer: myUserReducer
})

export default customRootReducer;