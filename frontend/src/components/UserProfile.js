import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
// import { useParams } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import PollCard from "./PollCard";

const UserProfile = () => {
    // const { id } = useParams();
    const { isAuthenticated, userId } = useContext(AuthContext);
    const [user, setUser] = useState(null);
    const [polls, setPolls] = useState([]);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/user/${userId}`);
                setUser(response.data);
            } catch (error) {
                alert("Failed to fetch user data! Error:", error);
            }
        };
        fetchUser();
    }, [userId]);

    useEffect(() => {
        const fetchPolls = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/polls/user/${userId}`);
                setPolls(response.data);
            } catch (error) {
                alert("Failed to fetch polls. Error:", error);
            }
        };
        fetchPolls();
    }, [userId]);

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <>
            {isAuthenticated && (
                <div>
                    <h2>User Profile</h2>
                    <p>Username: {user.username}</p>
                    <p>Email: {user.email}</p>
                    <h3>Created Polls</h3>
                    <div className="poll-list">
                        {polls.map((poll) => (
                            <PollCard key={poll.id} poll={poll} />
                        ))}
                    </div>
                </div>
            )}
        </>
    );
};

export default UserProfile;
