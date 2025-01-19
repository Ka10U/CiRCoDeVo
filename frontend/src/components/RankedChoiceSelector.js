import React, { useState, useEffect } from "react";
import SortableList, { SortableItem } from "react-easy-sort";
import { arrayMoveImmutable } from "array-move";

const shuffleArray = (array) => {
    for (let i = array.length - 1; i >= 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
};

const RankedChoiceSelector = ({ questionData, handler, questionId }) => {
    const [choices, setChoices] = useState([]);
    const [whiteVotesIndex, setWhiteVotesIndex] = useState(questionData.choices.length);
    const whiteVoteLabel = "Votes blancs en dessous";

    useEffect(() => {
        shuffleArray(questionData.choices);
        setChoices([...questionData.choices, whiteVoteLabel]);
    }, [questionData]);

    useEffect(() => {
        setWhiteVotesIndex(() => choices.indexOf(whiteVoteLabel));
        handler(
            questionId,
            choices.filter((_, id) => id < whiteVotesIndex)
        );
    }, [choices, whiteVotesIndex]);

    const onSortEnd = (oldIndex, newIndex) => {
        setChoices((array) => arrayMoveImmutable(array, oldIndex, newIndex));
    };

    return (
        <SortableList onSortEnd={onSortEnd} className="list" draggedItemClassName="dragged">
            {choices.map((choice, id) => (
                <SortableItem key={id}>
                    <div
                        className={`choice-vote ${
                            id < whiteVotesIndex ? "valid-choice" : id === whiteVotesIndex ? "white-threshold" : "white-vote"
                        }`}
                    >
                        <span className={id < whiteVotesIndex ? "ranked-id" : ""}>
                            {id < whiteVotesIndex ? +id + 1 + "  " : ""}
                        </span>
                        <label>{choice}</label>
                        <span>{id <= whiteVotesIndex ? "" : " --> Vote Blanc"}</span>
                    </div>
                </SortableItem>
            ))}
        </SortableList>
    );
};

export default RankedChoiceSelector;
