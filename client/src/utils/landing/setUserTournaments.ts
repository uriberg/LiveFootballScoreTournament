import axiosInstance from "../../axios";
import {DEBUG} from "../../constants/settings";

export const setUserTournaments = (tournamentId: any, joinedUser: any) => {
    axiosInstance().put('/users/joinTournament', {
        tournamentId: tournamentId,
        userId: joinedUser._id,
        nickname: joinedUser.nickname
        })
        .then(response => {
            DEBUG && console.log(response);
        })
        .catch(err => {DEBUG && console.log(err)});
};
