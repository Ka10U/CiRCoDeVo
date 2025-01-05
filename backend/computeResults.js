const computeResults = (data) => {
    const results = {};
    data.forEach((vote) => {
        const voteData = JSON.parse(JSON.parse(vote.vote_data));
        voteData.forEach((answer, index) => {
            if (results[index]) {
                if (results[index][answer]) {
                    results[index][answer]++;
                } else {
                    results[index][answer] = 1;
                }
            } else {
                results[index] = {};
                results[index].type = answer.type;
                results[index][answer] = 1;
            }
        });
    });
    return results;
};

export default computeResults;
