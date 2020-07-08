import axiosInstance from "../../axios";
import {DEBUG} from "../../constants/settings";

export const getTournament = async (tournamentId: any) => {
    let result:any = [];
    await axiosInstance().get('/tournaments/' + tournamentId)
        .then(response => {
            DEBUG && console.log(response);
            DEBUG && console.log(response.data);
            result = response.data;
        })
        .catch(err => {DEBUG && console.log(err)});
    return result;
};
