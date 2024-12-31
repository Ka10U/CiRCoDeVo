import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import axios from "axios";
import PollCard from "./PollCard";

const Landing = () => {
    const { isAuthenticated } = useContext(AuthContext);
    const [featuredPolls, setFeaturedPolls] = useState([]);

    useEffect(() => {
        const fetchFeaturedPolls = async () => {
            try {
                const response = await axios.get("http://localhost:3000/polls/featured");
                setFeaturedPolls(response.data);
            } catch (error) {
                alert("Failed to fetch featured polls");
            }
        };
        fetchFeaturedPolls();
    }, []);

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
                    <div>
                        <h2>Featured Polls</h2>
                        <div className="poll-list">
                            {featuredPolls.map((poll) => (
                                <PollCard key={poll.id} poll={poll} />
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Landing;
