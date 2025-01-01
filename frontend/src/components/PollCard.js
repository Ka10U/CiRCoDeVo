import React from "react";
import { Link } from "react-router-dom";

const PollCard = ({ poll }) => {
    const questions = JSON.parse(poll.questions);
    const categories = JSON.parse(poll.categories);
    console.log(poll.id, categories);
    categories.forEach((category, id) => console.log(id, category));

    return (
        <div className="poll-card">
            <Link to={`/poll/${poll.id}`}>
                <img src={poll.image_url} alt={poll.title} />
                <h3>{poll.title}</h3>
                <p>Auteur: {poll.creator_id}</p>
                <p>Nombre de questions: {questions.length}</p>
                <div className="categories-card-list">
                    {categories.length ? (
                        <>
                            <p>Catégorie(s):</p>
                            {categories.map((category, id) => (
                                <span key={id}>{category}</span>
                            ))}
                        </>
                    ) : (
                        <span>Uncategorized</span>
                    )}
                </div>
                <p>Nombre de votants: {poll.votes ? poll.votes.length : 0}</p>
            </Link>
        </div>
    );
};

export default PollCard;
