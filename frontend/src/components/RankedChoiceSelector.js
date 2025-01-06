import React, { useState, useEffect } from "react";
import SortableList, { SortableItem } from "react-easy-sort";
import { arrayMoveImmutable } from "array-move";

const shuffleArray = (array) => {
    for (let i = array.length - 1; i >= 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
};

const RankedChoiceSelector = ({ questionData }) => {
    const [choices, setChoices] = useState([]);
    const [whiteVotesIndex, setWhiteVotesIndex] = useState(questionData.choices.length);
    const whiteVoteLabel = "Votes blancs en dessous";

    useEffect(() => {
        shuffleArray(questionData.choices);
        setChoices([...questionData.choices, whiteVoteLabel]);
    }, [questionData]);

    useEffect(() => {
        setWhiteVotesIndex(() => choices.indexOf(whiteVoteLabel));
    }, [choices]);

    const onSortEnd = (oldIndex, newIndex) => {
        setChoices((array) => arrayMoveImmutable(array, oldIndex, newIndex));
    };

    return (
        <SortableList onSortEnd={onSortEnd} className="list" draggedItemClassName="dragged">
            {choices.map((choice, id) => (
                <SortableItem key={id}>
                    <div className={`choice-vote ${id < whiteVotesIndex ? "valid-choice" : "white-vote"}`}>
                        {`${+id + 1}. `}
                        {id <= whiteVotesIndex ? choice : "Vote Blanc"}
                    </div>
                </SortableItem>
            ))}
        </SortableList>
    );
};

export default RankedChoiceSelector;
