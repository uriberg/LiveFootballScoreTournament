import axiosInstance from "../../axios";

export const setTournamentCreator = (userId: string, tournamentId: any) => {
    axiosInstance().put('/users/setCreator', {userId: userId, tournamentId: tournamentId})
        .then(response => {
            console.log(response);
        })
        .catch(err => {console.log(err)});
};
