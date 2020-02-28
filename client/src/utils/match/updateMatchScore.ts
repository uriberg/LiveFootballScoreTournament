import axiosInstance from "../../axios";

export const updateMatchScore = (goalsHomeTeam: number, goalsAwayTeam: number, matchId: any) => {
    axiosInstance().put('/matches/' + matchId + '/result', {goalsHomeTeam: goalsHomeTeam, goalsAwayTeam: goalsAwayTeam})
        .then(response => {console.log(response)})
        .catch(err => {console.log(err)});
};
