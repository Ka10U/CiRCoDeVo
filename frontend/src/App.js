import React from "react";
// import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import RecoverPassword from "./components/RecoverPassword";
import ResetPassword from "./components/ResetPassword";
import Landing from "./components/Landing";

function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Landing />}></Route>
                    <Route path="/register" element={<Register />}></Route>
                    <Route path="/login" element={<Login />}></Route>
                    <Route path="/recover" element={<RecoverPassword />}></Route>
                    <Route path="/reset/:token" element={<ResetPassword />}></Route>
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
