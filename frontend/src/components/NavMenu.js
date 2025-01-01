import React, { useContext } from "react";
import { AuthContext } from "./AuthContext";
import "./NavMenu.css";

const NavMenu = () => {
    const { isAuthenticated, userId } = useContext(AuthContext);

    return (
        <nav>
            <ul className="nav-menu">
                <li>
                    <a href="/">Home</a>
                </li>
                {isAuthenticated && (
                    <li>
                        <a href="/polls/create">Créer</a>
                    </li>
                )}
                {isAuthenticated && (
                    <li>
                        <a href={`/user/${userId}`}>Profile</a>
                    </li>
                )}
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
