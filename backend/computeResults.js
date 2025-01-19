// voteData: [{"question_0": {"type": "text", "value": "answer"}, "question_1": {"type": "ranked", "value": ["answer_1", "answer_2"], "quesiton_2": {"type": "referendum", "value": "yes"} }]

const computeResults = (data, questions) => {
    const results = {};
    data.forEach((vote) => {
        const voteData = vote.vote_data;
        voteData.forEach((answer, index) => {
            if (answer.type !== "ranked_choice") {
                if (results[index]) {
                    if (results[index][answer.value]) {
                        results[index][answer.value]++;
                    } else {
                        results[index][answer.value] = 1;
                    }
                } else {
                    results[index] = {};
                    results[index].type = answer.type;
                    results[index][answer.value] = 1;
                }
            } else {
                // Cas particulier Ranked Choice Voting
                results[index] = {};
                results[index].type = answer.type;
                results[index][answer.value] = rankedRounds(
                    questions[index].choices,
                    data.filter((vote) => vote.vote_data[index])
                );
            }
        });
    });
    return results;
};

const rankedRounds = (options, votesList, round = 0, result = {}) => {
    if (options.length === 0) {
        return result;
    }
    if (round === 0) {
        options.forEach((option) => {
            result[option] = 0;
        });
    }
    votesList.forEach((vote) => {
        const voteData = vote.vote_data;
        voteData.forEach((answer, index) => {
            if (answer.type === "ranked_choice") {
                if (round[answer.value]) {
                    round[answer.value]++;
                } else {
                    round[answer.value] = 1;
                }
            }
        });
    });
    const votes = votesList.map((vote) => vote.vote_data);
};

export default computeResults;
