import axiosInstance from "../../axios";

export const setUserTournaments = (tournamentId: any, joinedUser: any) => {
    axiosInstance().put('/users/joinTournament', {
        tournamentId: tournamentId,
        userId: joinedUser._id,
        nickname: joinedUser.nickname
        })
        .then(response => {
            console.log(response);
        })
        .catch(err => {console.log(err)});
};
