import {DEBUG} from "../../constants/settings";

export const updateTournamentRound = (users: any) => {
    let updatedScore = [...users];
    DEBUG && console.log(updatedScore);
    for (let i = 0; i < updatedScore.length; i++) {
        // @ts-ignore
        updatedScore[i].totalScore = updatedScore[i].totalScore + updatedScore[i].weeklyScore;
        // @ts-ignore
        updatedScore[i].weeklyScore = 0;
    }
    DEBUG && console.log(updatedScore);
    return updatedScore;
};
