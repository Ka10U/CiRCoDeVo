import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

const CreatePoll = () => {
    const [title, setTitle] = useState("");
    const [choices, setChoices] = useState([""]);
    const [votingPeriodEnd, setVotingPeriodEnd] = useState("");
    const { isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleAddChoice = () => {
        setChoices([...choices, ""]);
    };

    const handleChoiceChange = (index, value) => {
        const newChoices = [...choices];
        newChoices[index] = value;
        setChoices(newChoices);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) {
            alert("You must be logged in to create a poll");
            return;
        }
        try {
            const response = await axios.post("http://localhost:3000/polls/create", {
                userId: 1, // Remplacez par l'ID de l'utilisateur authentifié
                title,
                choices,
                votingPeriodEnd,
            });
            alert("Poll created successfully");
            navigate("/");
        } catch (error) {
            alert("Poll creation failed");
        }
    };

    return (
        <div>
            <h2>Create Poll</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
                {choices.map((choice, index) => (
                    <input
                        key={index}
                        type="text"
                        placeholder={`Choice ${index + 1}`}
                        value={choice}
                        onChange={(e) => handleChoiceChange(index, e.target.value)}
                    />
                ))}
                <button type="button" onClick={handleAddChoice}>
                    Add Choice
                </button>
                <input type="datetime-local" value={votingPeriodEnd} onChange={(e) => setVotingPeriodEnd(e.target.value)} />
                <button type="submit">Create Poll</button>
            </form>
        </div>
    );
};

export default CreatePoll;
