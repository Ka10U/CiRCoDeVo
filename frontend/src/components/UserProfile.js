import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import PollCard from "./PollCard";

const UserProfile = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [polls, setPolls] = useState([]);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/user/${id}`);
                setUser(response.data);
            } catch (error) {
                alert("Failed to fetch user data");
            }
        };
        fetchUser();
    }, [id]);

    useEffect(() => {
        const fetchPolls = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/polls/user/${id}`);
                setPolls(response.data);
            } catch (error) {
                alert("Failed to fetch polls");
            }
        };
        fetchPolls();
    }, [id]);

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
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
    );
};

export default UserProfile;
