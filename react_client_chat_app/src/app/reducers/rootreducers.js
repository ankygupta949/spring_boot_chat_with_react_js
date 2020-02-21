import {myStompClientReducer} from './stompclientreducer'
import {combineReducers} from "redux";
const customRootReducer = combineReducers({
    stmpCltReducer: myStompClientReducer
})

export default customRootReducer;