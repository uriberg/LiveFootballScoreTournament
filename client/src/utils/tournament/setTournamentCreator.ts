import axiosInstance from "../../axios";

export const setTournamentCreator = (userId: string, tournamentId: any, nickname: string) => {
    axiosInstance().put('/users/setCreator', {userId: userId, tournamentId: tournamentId, nickname: nickname})
        .then(response => {
            console.log(response);
        })
        .catch(err => {console.log(err)});
};
