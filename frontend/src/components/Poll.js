import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

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

    const handleVote = (choiceIndex) => {
        setVotes({ ...votes, [choiceIndex]: (votes[choiceIndex] || 0) + 1 });
    };

    if (!poll) {
        return <div>Loading...</div>;
    }

    const choices = JSON.parse(poll.choices);
    const isVotingPeriodOver = Date.now() > poll.voting_period_end;

    return (
        <div>
            <h2>{poll.title}</h2>
            {isVotingPeriodOver ? (
                <div>
                    <h3>Results</h3>
                    {choices.map((choice, index) => (
                        <div key={index}>
                            {choice}: {votes[index] || 0} votes
                        </div>
                    ))}
                </div>
            ) : (
                <div>
                    <h3>Vote</h3>
                    {choices.map((choice, index) => (
                        <div key={index}>
                            <button onClick={() => handleVote(index)}>{choice}</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Poll;
