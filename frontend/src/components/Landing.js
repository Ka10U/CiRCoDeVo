import React, { useContext } from "react";
import { AuthContext } from "./AuthContext";

const Landing = () => {
    const { isAuthenticated } = useContext(AuthContext);

    return (
        <div className="landinghero">
            {isAuthenticated ? (
                <>
                    <h1>Welcome to your CIRCODEVO App</h1>
                    <h3>It's all about Collective Intelligence.</h3>
                    <p>You can check below trending discussions and upcoming votes...</p>
                </>
            ) : (
                <>
                    {" "}
                    <h1>Welcome to CIRCODEVO</h1>
                    <h3>It's all about Collective Intelligence.</h3>
                    <p>
                        This web platform aims at promoting Collective Intelligence and provides a technical solution based upon
                        Ranked Choice Voting with optional vote Delegation.
                    </p>
                </>
            )}
        </div>
    );
};

export default Landing;
