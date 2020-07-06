import axiosInstance from "../../axios";

export const setMatchStatus = (matchId: any, statusShort: any) => {
    axiosInstance().put('/matches/' + matchId + '/status', {statusShort: statusShort})
        .then(response => {console.log(response)})
        .catch(err => {console.log(err)});
};
