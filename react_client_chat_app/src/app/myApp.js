import React from "react";
import ErrorBoundary from 'react-error-boundary';
import {Login} from "./components/Login";
import {BrowserRouter, Route} from "react-router-dom";

export class MyApp extends React.Component {

    render() {
        return (

            <ErrorBoundary>
                <BrowserRouter>

                <div>
                <Route path="/login" component={Login} />
                </div>
                </BrowserRouter>

            </ErrorBoundary>
        )
    };

}