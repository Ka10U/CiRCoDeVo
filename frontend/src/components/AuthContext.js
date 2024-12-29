import React, { createContext, useState, useEffect } from "react";
import { useCookies } from "react-cookie";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [cookies, setCookie, removeCookie] = useCookies(["authToken"]);

    useEffect(() => {
        if (cookies.authToken) {
            setIsAuthenticated(true);
        }
    }, [cookies.authToken]);

    const login = (token) => {
        setCookie("authToken", token, { path: "/" });
        setIsAuthenticated(true);
    };

    const logout = () => {
        removeCookie("authToken", { path: "/" });
        setIsAuthenticated(false);
    };

    return <AuthContext.Provider value={{ isAuthenticated, login, logout }}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
