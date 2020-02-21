import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import {createStore} from "redux";
import {Provider} from "react-redux";
import StompClientReducer from '../src/reducers/StompClientReducer'

const myStore=createStore(StompClientReducer);
//we have to pass reducer as parameter in createstore() method

ReactDOM.render(<Provider store={myStore}><App/></Provider>,window.document.getElementById("root"));registerServiceWorker();
