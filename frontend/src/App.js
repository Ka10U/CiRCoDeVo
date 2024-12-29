import React from "react";
// import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Logout from "./components/Logout";
import RecoverPassword from "./components/RecoverPassword";
import ResetPassword from "./components/ResetPassword";
import Landing from "./components/Landing";
import NavMenu from "./components/NavMenu";
import AuthContext from "./components/AuthContext";

function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <AuthContext>
                    <NavMenu></NavMenu>
                    <Routes>
                        <Route path="/" element={<Landing />}></Route>
                        <Route path="/register" element={<Register />}></Route>
                        <Route path="/login" element={<Login />}></Route>
                        <Route path="/logout" element={<Logout />}></Route>
                        <Route path="/recover" element={<RecoverPassword />}></Route>
                        <Route path="/reset/:token" element={<ResetPassword />}></Route>
                    </Routes>
                </AuthContext>
            </div>
        </BrowserRouter>
    );
}

export default App;
