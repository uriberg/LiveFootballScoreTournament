import axiosInstance from "../../axios";

export const getTournamentCalculatedMatches = async (tournamentId: any) => {
    let result:any = [];
    await axiosInstance().get('/tournaments/' + tournamentId + '/calculatedMatches')
        .then(response => {
            console.log('CALCULATED MATCHES');
            console.log(response.data);
            result = response.data;
        })
        .catch(err => {console.log(err)});
    return result;
};
