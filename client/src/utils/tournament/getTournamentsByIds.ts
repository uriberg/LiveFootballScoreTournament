import axiosInstance from "../../axios";
import {DEBUG} from "../../constants/settings";

export const getTournamentsByIds = async (desiredTournamentsIds: any) => {
    let result:any = [];
     await axiosInstance().put('/tournaments/Ids', {desiredTournamentsIds: desiredTournamentsIds})
        .then(response => {
            DEBUG && console.log(response);
            DEBUG && console.log(response.data);
            result = response.data;
        })
        .catch(err => {DEBUG && console.log(err)});
     return result;
};
