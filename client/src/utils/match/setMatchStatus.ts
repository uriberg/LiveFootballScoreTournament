import axiosInstance from "../../axios";
import {DEBUG} from "../../constants/settings";

export const setMatchStatus = (matchId: any, statusShort: any) => {
    axiosInstance().put('/matches/' + matchId + '/status', {statusShort: statusShort})
        .then(response => {DEBUG && console.log(response)})
        .catch(err => {DEBUG && console.log(err)});
};
