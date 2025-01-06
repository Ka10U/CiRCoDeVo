import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import PollVote from "./PollVote";

const Poll = () => {
    const { id } = useParams();
    const [poll, setPoll] = useState(null);
    const [votes, setVotes] = useState({});

    useEffect(() => {
        const fetchPoll = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/poll/${id}`);
                setPoll(response.data);
            } catch (error) {
                alert("Failed to fetch poll");
            }
        };
        fetchPoll();
    }, [id]);

    if (!poll) {
        return <div>Loading...</div>;
    }

    const questions = JSON.parse(JSON.parse(poll.questions));
    const categories = JSON.parse(JSON.parse(poll.categories));
    const isVotingPeriodOver = Date.now() > poll.voting_period_end;

    return (
        <div>
            <h2>{poll.title}</h2>
            <p>Categories: {categories.join(", ")}</p>
            {isVotingPeriodOver ? (
                <div>
                    <h3>Results</h3>
                    {questions.map((question, index) => (
                        <div key={index}>
                            <h4>{question.text}</h4>
                            {question.type === "referendum" && (
                                <div>
                                    <p>Oui: {votes[index] === 0 ? "Voted" : "Not Voted"}</p>
                                    <p>Non: {votes[index] === 1 ? "Voted" : "Not Voted"}</p>
                                </div>
                            )}
                            {question.type === "ranked_choice" && (
                                <div>
                                    {question.choices.map((choice, choiceIndex) => (
                                        <p key={choiceIndex}>
                                            {choice}: {votes[index] === choiceIndex ? "Voted" : "Not Voted"}
                                        </p>
                                    ))}
                                </div>
                            )}
                            {question.type === "value" && (
                                <div>
                                    <p>Value: {votes[index] || "Not Voted"}</p>
                                </div>
                            )}
                            {question.type === "text" && (
                                <div>
                                    <p>Text: {votes[index] || "Not Voted"}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <PollVote pollId={id} />
            )}
        </div>
    );
};

export default Poll;
