import React, { useState, useEffect } from "react";
import axios from "axios";
import RankedChoiceSelector from "./RankedChoiceSelector";
// import { useParams } from "react-router-dom";

const PollVote = ({ pollId }) => {
    const [questions, setQuestions] = useState([]);
    const [votes, setVotes] = useState({});
    const [selectedChoices, setSelectedChoices] = useState({});

    useEffect(() => {
        const fetchPoll = async () => {
            const response = await axios.get(`http://localhost:3000/poll/${pollId}`);
            setQuestions(JSON.parse(JSON.parse(response.data.questions)));
        };

        fetchPoll();
    }, [pollId]);

    const handleVote = (questionIndex, choiceIndex) => {
        setVotes((prevVotes) => ({
            ...prevVotes,
            [questionIndex]: choiceIndex,
        }));

        setSelectedChoices((prevChoices) => ({
            ...prevChoices,
            [questionIndex]: choiceIndex,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("questions: ", questions);
        console.log("votes: ", votes);
        console.log("selectedChoices: ", selectedChoices);
        // try {
        //     const response = await axios.post(`http://localhost:3000/poll/${pollId}/vote`, {
        //         userId: localStorage.getItem("userId"), // Utiliser l'ID de l'utilisateur authentifié
        //         votes: votes,
        //     });
        //     console.log(response.data);
        //     alert("Vote submitted successfully");
        // } catch (error) {
        //     alert("Vote submission failed. Error:", error);
        // }
    };

    return (
        <div>
            <h2>Vote for Poll</h2>
            {questions.map((question, index) => (
                <div key={index}>
                    <p>{question.text}</p>
                    {question.type === "referendum" && (
                        <div>
                            <button onClick={() => handleVote(index, 0)}>Yes</button>
                            <button onClick={() => handleVote(index, 1)}>No</button>
                        </div>
                    )}
                    {question.type === "ranked_choice" && <RankedChoiceSelector questionData={question} />}
                    {question.type === "value" && (
                        <div>
                            <input
                                type="number"
                                placeholder="Enter your value"
                                onChange={(e) => handleVote(index, e.target.value)}
                            />
                        </div>
                    )}
                    {question.type === "text" && (
                        <div>
                            <input
                                type="text"
                                placeholder="Enter your answer"
                                onChange={(e) => handleVote(index, e.target.value)}
                            />
                        </div>
                    )}
                </div>
            ))}
            <button onClick={handleSubmit}>Submit</button>
        </div>
    );
};

export default PollVote;
