import React, { createContext, useState, useEffect } from "react";
import { useCookies } from "react-cookie";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userId, setUserId] = useState(null);
    const [cookies, setCookie, removeCookie] = useCookies(["authToken"]);

    useEffect(() => {
        if (cookies.authToken) {
            setIsAuthenticated(true);
            // Récupérer l'ID de l'utilisateur à partir du localStorage
            const storedUserId = localStorage.getItem("userId");
            if (storedUserId) {
                setUserId(storedUserId);
            }
        }
    }, [cookies.authToken]);

    const login = (token, userId) => {
        setCookie("authToken", token, { path: "/" });
        setIsAuthenticated(true);
        setUserId(userId);
        // Sauvegarder l'ID de l'utilisateur dans le localStorage
        localStorage.setItem("userId", userId);
        console.log("USER LOGGED IN");
    };

    const logout = () => {
        removeCookie("authToken", { path: "/" });
        setIsAuthenticated(false);
        setUserId(null);
        // Supprimer l'ID de l'utilisateur du localStorage
        localStorage.removeItem("userId");
        console.log("USER LOGGED OUT");
    };

    return <AuthContext.Provider value={{ isAuthenticated, userId, login, logout }}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
