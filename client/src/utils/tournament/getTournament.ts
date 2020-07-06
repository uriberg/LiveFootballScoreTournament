import axiosInstance from "../../axios";

export const getTournament = async (tournamentId: any) => {
    let result:any = [];
    await axiosInstance().get('/tournaments/' + tournamentId)
        .then(response => {
            console.log(response);
            console.log(response.data);
            result = response.data;
        })
        .catch(err => {console.log(err)});
    return result;
};
