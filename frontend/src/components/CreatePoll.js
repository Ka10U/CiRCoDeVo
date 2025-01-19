import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

import SortableList, { SortableItem } from "react-easy-sort";
import { arrayMoveImmutable } from "array-move";

const CreatePoll = () => {
    const [title, setTitle] = useState("");
    const [questions, setQuestions] = useState([{ type: "referendum", text: "", choices: ["Oui", "Non"] }]);
    // const [choices, setChoices] = useState([""]);
    const [votingPeriodStart, setVotingPeriodStart] = useState(new Date(Date.now()).toISOString());
    const [votingPeriodEnd, setVotingPeriodEnd] = useState("");
    const [categories, setCategories] = useState([]);
    const [image, setImage] = useState(null);
    const { isAuthenticated, userId } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleAddQuestion = () => {
        setQuestions([...questions, { type: "referendum", text: "", choices: ["Oui", "Non"] }]);
    };

    const handleRemoveQuestion = (index) => {
        setQuestions([...questions.slice(0, index), ...questions.slice(index + 1)]);
    };

    const handleQuestionChange = (index, field, value) => {
        const newQuestions = [...questions];
        newQuestions[index][field] = value;
        if (
            (field === "type" && ["value", "text"].includes(value)) ||
            (field === "type" &&
                value === "ranked_choice" &&
                newQuestions[index].choices.length === 2 &&
                newQuestions[index].choices[0] === "Oui" &&
                newQuestions[index].choices[1] === "Non")
        ) {
            newQuestions[index].choices = [""];
        }
        setQuestions(newQuestions);
    };

    const handleChoiceChange = (questionIndex, choiceIndex, value) => {
        const newQuestions = [...questions];
        newQuestions[questionIndex].choices[choiceIndex] = value;
        setQuestions(newQuestions);
    };

    const handleRemoveChoice = (questionIndex, choiceIndex) => {
        const newQuestions = [...questions];
        newQuestions[questionIndex].choices = [
            ...newQuestions[questionIndex].choices.slice(0, choiceIndex),
            ...newQuestions[questionIndex].choices.slice(choiceIndex + 1),
        ];
        setQuestions(newQuestions);
    };

    const handleCategoryChange = (category) => {
        setCategories((prevCategories) =>
            prevCategories.includes(category) ? prevCategories.filter((cat) => cat !== category) : [...prevCategories, category]
        );
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const onQuestionsSortEnd = (oldIndex, newIndex) => {
        setQuestions((array) => arrayMoveImmutable(array, oldIndex, newIndex));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) {
            alert("You must be logged in to create a poll");
            return;
        }

        console.log("Questions:", questions);

        const formData = new FormData();
        formData.append("image", image);
        formData.append("userId", userId); // Remplacez par l'ID de l'utilisateur authentifié
        formData.append("title", title);
        formData.append("questions", questions);
        formData.append("votingPeriodStart", votingPeriodStart);
        formData.append("votingPeriodEnd", votingPeriodEnd);
        formData.append("categories", categories);

        try {
            const response = await axios.post("http://localhost:3000/polls/create", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            alert("Poll created successfully");
            console.log(response.data);
            navigate("/");
        } catch (error) {
            console.log("Poll creation failed. error: ", error);
            alert("Poll creation failed. error: ", error);
        }
    };

    const categoriesList = [
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
            <div className="create-poll">
                <form onSubmit={handleSubmit}>
                    <div>
                        <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
                        <input type="file" onChange={handleImageChange} />
                    </div>
                    <div className="categories-list">
                        {categoriesList.map((category) => (
                            <label key={category}>
                                <input
                                    type="checkbox"
                                    checked={categories.includes(category)}
                                    onChange={() => handleCategoryChange(category)}
                                />
                                {category}
                            </label>
                        ))}
                    </div>
                    <div className="voting-period">
                        <label>Poll start</label>
                        <input
                            type="datetime-local"
                            value={votingPeriodStart}
                            onChange={(e) => setVotingPeriodStart(e.target.value)}
                        />
                        <label>Poll end</label>
                        <input
                            type="datetime-local"
                            value={votingPeriodEnd}
                            onChange={(e) => setVotingPeriodEnd(e.target.value)}
                        />{" "}
                    </div>
                    <SortableList onSortEnd={onQuestionsSortEnd} className="list" draggedItemClassName="dragged">
                        {questions.map((question, index) => (
                            <div className="question" key={index}>
                                <SortableItem>
                                    <span>{+index + 1}</span>
                                </SortableItem>

                                <input
                                    // key={index}
                                    type="text"
                                    placeholder={`Question ${index + 1}`}
                                    value={question.text}
                                    onChange={(e) => handleQuestionChange(index, "text", e.target.value)}
                                />
                                <select
                                    value={question.type}
                                    onChange={(e) => handleQuestionChange(index, "type", e.target.value)}
                                >
                                    <option value="referendum">Referendum</option>
                                    <option value="ranked_choice">Ranked Choice</option>
                                    <option value="value">Value</option>
                                    <option value="text">Text</option>
                                </select>
                                <button className="remove" type="button" onClick={(e) => handleRemoveQuestion(index)}>
                                    X
                                </button>

                                {question.type === "ranked_choice" && (
                                    <div className="question-choices">
                                        {question.choices.map((choice, choiceIndex) => (
                                            <div className="choice" key={choiceIndex}>
                                                <input
                                                    type="text"
                                                    placeholder={`Choice ${choiceIndex + 1}`}
                                                    value={choice}
                                                    onChange={(e) => handleChoiceChange(index, choiceIndex, e.target.value)}
                                                />
                                                <button
                                                    className="remove"
                                                    type="button"
                                                    onClick={(e) => handleRemoveChoice(index, choiceIndex)}
                                                >
                                                    X
                                                </button>
                                            </div>
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
                    </SortableList>
                    <button type="button" onClick={handleAddQuestion}>
                        Add Question
                    </button>
                    {/* TODO Handle error cases where start date is after end date && case where end date is befo */}
                    <button type="submit">Create Poll</button>
                </form>
            </div>
        </div>
    );
};

export default CreatePoll;
