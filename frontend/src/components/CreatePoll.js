import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

const CreatePoll = () => {
    const [title, setTitle] = useState("");
    const [questions, setQuestions] = useState([{ type: "referendum", text: "", choices: ["Oui", "Non"], categories: [] }]);
    // const [choices, setChoices] = useState([""]);
    const [votingPeriodStart, setVotingPeriodStart] = useState("");
    const [votingPeriodEnd, setVotingPeriodEnd] = useState("");
    const { isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleAddQuestion = () => {
        setQuestions([...questions, { type: "referendum", text: "", choices: ["Oui", "Non"], categories: [] }]);
    };

    const handleRemoveQuestion = (index) => {
        setQuestions([...questions.slice(0, index), ...questions.slice(index + 1)]);
    };

    const handleQuestionChange = (index, field, value) => {
        const newQuestions = [...questions];
        newQuestions[index][field] = value;
        setQuestions(newQuestions);
    };

    const handleChoiceChange = (questionIndex, choiceIndex, value) => {
        const newQuestions = [...questions];
        newQuestions[questionIndex].choices[choiceIndex] = value;
        setQuestions(newQuestions);
    };

    const handleCategoryChange = (questionIndex, category) => {
        const newQuestions = [...questions];
        if (newQuestions[questionIndex].categories.includes(category)) {
            newQuestions[questionIndex].categories = newQuestions[questionIndex].categories.filter((cat) => cat !== category);
        } else {
            newQuestions[questionIndex].categories.push(category);
        }
        setQuestions(newQuestions);
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
                questions,
                votingPeriodStart,
                votingPeriodEnd,
            });
            alert("Poll created successfully");
            console.log(response).data;
            navigate("/");
        } catch (error) {
            alert("Poll creation failed");
        }
    };

    const categories = [
        "Défense",
        "Justice",
        "Intérieur",
        "Finances",
        "Économie",
        "Diplomatie",
        "Société civile",
        "Éducation",
        "Recherche",
        "Environnement",
        "Santé",
        "Travail",
        "Industrie",
        "Agriculture",
        "Culture",
        "Sports",
        "Avenir",
    ];

    return (
        <div>
            <h2>Create Poll</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
                {questions.map((question, index) => (
                    <div className="question" key={index}>
                        <input
                            // key={index}
                            type="text"
                            placeholder={`Question ${index + 1}`}
                            value={question.text}
                            onChange={(e) => handleQuestionChange(index, "text", e.target.value)}
                        />
                        <select value={question.type} onChange={(e) => handleQuestionChange(index, "type", e.target.value)}>
                            <option value="referendum">Referendum</option>
                            <option value="ranked_choice">Ranked Choice</option>
                            <option value="value">Value</option>
                        </select>
                        <div>
                            {categories.map((category) => (
                                <label key={category}>
                                    <input
                                        type="checkbox"
                                        checked={question.categories.includes(category)}
                                        onChange={() => handleCategoryChange(index, category)}
                                    />
                                    {category}
                                </label>
                            ))}
                        </div>
                        <button type="button" onClick={(e) => handleRemoveQuestion(index)}>
                            X
                        </button>
                        {question.type === "ranked_choice" && (
                            <div>
                                {question.choices.map((choice, choiceIndex) => (
                                    <input
                                        key={choiceIndex}
                                        type="text"
                                        placeholder={`Choice ${choiceIndex + 1}`}
                                        value={choice}
                                        onChange={(e) => handleChoiceChange(index, choiceIndex, e.target.value)}
                                    />
                                ))}
                                <button
                                    type="button"
                                    onClick={() => handleQuestionChange(index, "choices", [...question.choices, ""])}
                                >
                                    Add Choice
                                </button>
                            </div>
                        )}
                    </div>
                ))}
                <button type="button" onClick={handleAddQuestion}>
                    Add Question
                </button>
                {/* TODO Handle error cases where start date is after end date && case where end date is befo */}
                <input type="datetime-local" value={votingPeriodStart} onChange={(e) => setVotingPeriodStart(e.target.value)} />
                <input type="datetime-local" value={votingPeriodEnd} onChange={(e) => setVotingPeriodEnd(e.target.value)} />{" "}
                <button type="submit">Create Poll</button>
            </form>
        </div>
    );
};

export default CreatePoll;
