import axiosInstance from "../../axios";
import {DEBUG} from "../../constants/settings";

export const setCalculatedMatches = (tournamentId:any, updatedCalculatedMatches: any) => {
    axiosInstance().put('/tournaments/' + tournamentId + '/setCalculatedMatches', {calculatedMatches: updatedCalculatedMatches})
        .then(response => {
            DEBUG && console.log(response);
        })
        .catch(err => {DEBUG && console.log(err)});
};
