import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import RecoverPassword from "./components/RecoverPassword";
import ResetPassword from "./components/ResetPassword";

function App() {
    return (
        <Router>
            <div className="App">
                <Switch>
                    <Route path="/register" component={Register} />
                    <Route path="/login" component={Login} />
                    <Route path="/recover" component={RecoverPassword} />
                    <Route path="/reset/:token" component={ResetPassword} />
                </Switch>
            </div>
        </Router>
    );
}

export default App;
