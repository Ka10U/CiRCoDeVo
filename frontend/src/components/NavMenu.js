import React, { useContext } from "react";
import { AuthContext } from "./AuthContext";

const NavMenu = () => {
    const { isAuthenticated } = useContext(AuthContext);

    return (
        <nav>
            <ul className="nav-menu">
                <li>
                    <a href="/">Home</a>
                </li>
                {isAuthenticated && (
                    <li>
                        <a href="/logout">Logout</a>
                    </li>
                )}
                {!isAuthenticated && (
                    <li>
                        <a href="/register">Register</a>
                    </li>
                )}
                {!isAuthenticated && (
                    <li>
                        <a href="/login">Login</a>
                    </li>
                )}
            </ul>
        </nav>
    );
};

export default NavMenu;
