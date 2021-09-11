import React from 'react';
import {Route, BrowserRouter} from "react-router-dom";

import Home from './pages/Home';
import CreateMechanical from './pages/CreateMechanical';

const Routes = () => {
    return(
        <BrowserRouter>
            <Route component={Home} path="/" exact/>
            <Route component={CreateMechanical} path="/create-mechanical" />
        </BrowserRouter>
    );
}

export default Routes;