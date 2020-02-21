
import React from "react";
import {render} from "react-dom";
import thunk from "redux-thunk";
import {applyMiddleware, createStore} from "redux";
import customRootReducer from "./reducers/rootreducers";
import Provider from "react-redux/es/components/Provider";
import {MyApp} from "./myApp";
import ReactDOM from "react-dom";


const middleware= [thunk];
const myStore = createStore(customRootReducer,applyMiddleware(...middleware));
ReactDOM.render(<Provider store={myStore}><MyApp/></Provider>,window.document.getElementById("abc") )

