import axiosInstance from "../../axios";

export const setCalculatedMatches = (tournamentId:any, updatedCalculatedMatches: any) => {
    axiosInstance().put('/tournaments/' + tournamentId + '/setCalculatedMatches', {calculatedMatches: updatedCalculatedMatches})
        .then(response => {
            console.log(response);
        })
        .catch(err => {console.log(err)});
};
