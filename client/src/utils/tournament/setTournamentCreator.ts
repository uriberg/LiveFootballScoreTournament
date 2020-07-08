import axiosInstance from "../../axios";
import {DEBUG} from "../../constants/settings";

export const setTournamentCreator = (userId: string, tournamentId: any, nickname: string) => {
    axiosInstance().put('/users/setCreator', {userId: userId, tournamentId: tournamentId, nickname: nickname})
        .then(response => {
            DEBUG && console.log(response);
        })
        .catch(err => {DEBUG && console.log(err)});
};
