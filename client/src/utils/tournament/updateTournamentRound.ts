
export const updateTournamentRound = (users: any) => {
    let updatedScore = [...users];
    console.log(updatedScore);
    for (let i = 0; i < updatedScore.length; i++) {
        // @ts-ignore
        updatedScore[i].totalScore = updatedScore[i].totalScore + updatedScore[i].weeklyScore;
        // @ts-ignore
        updatedScore[i].weeklyScore = 0;
    }
    console.log(updatedScore);
    return updatedScore;
};
