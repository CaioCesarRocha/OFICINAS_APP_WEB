import React from 'react';
import {Route, BrowserRouter} from "react-router-dom";

import Home from './pages/Home';
import Login from './pages/Login';
import CreateUser from './pages/CreateUser';
import CreateMechanical from './pages/CreateMechanical';

const Routes = () => {
    return(
        <BrowserRouter>
            <Route component={Home} path="/" exact/>
            <Route component={Login} path="/login" />
            <Route component={CreateUser} path="/create-user" />
            <Route component={CreateMechanical} path="/create-mechanical" />
        </BrowserRouter>
    );
}

export default Routes;