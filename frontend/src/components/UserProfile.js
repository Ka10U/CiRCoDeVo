import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const UserProfile = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);

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

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>User Profile</h2>
            <p>Username: {user.username}</p>
            <p>Email: {user.email}</p>
            <p>Created Polls: {user.created_polls}</p>
            <p>Participated Polls: {user.participated_polls}</p>
        </div>
    );
};

export default UserProfile;
