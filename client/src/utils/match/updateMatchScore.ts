import axiosInstance from "../../axios";
import {DEBUG} from "../../constants/settings";

export const updateMatchScore = async (goalsHomeTeam: number, goalsAwayTeam: number, matchId: any) => {
    await axiosInstance().put('/matches/' + matchId + '/result', {goalsHomeTeam: goalsHomeTeam, goalsAwayTeam: goalsAwayTeam})
        .then(response => {DEBUG && console.log(response)})
        .catch(err => {DEBUG && console.log(err)});
};
