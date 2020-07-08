import axiosInstance from "../../axios";
import {DEBUG} from "../../constants/settings";

export const getTournamentCalculatedMatches = async (tournamentId: any) => {
    let result:any = [];
    await axiosInstance().get('/tournaments/' + tournamentId + '/calculatedMatches')
        .then(response => {
            DEBUG && console.log('CALCULATED MATCHES');
            DEBUG && console.log(response.data);
            result = response.data;
        })
        .catch(err => {DEBUG && console.log(err)});
    return result;
};
