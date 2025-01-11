const computeResults = (data) => {
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
            }
        });
    });
    return results;
};

export default computeResults;
