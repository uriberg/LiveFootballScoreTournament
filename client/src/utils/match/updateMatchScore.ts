import axiosInstance from "../../axios";

export const updateMatchScore = async (goalsHomeTeam: number, goalsAwayTeam: number, matchId: any) => {
    await axiosInstance().put('/matches/' + matchId + '/result', {goalsHomeTeam: goalsHomeTeam, goalsAwayTeam: goalsAwayTeam})
        .then(response => {console.log(response)})
        .catch(err => {console.log(err)});
};
