import axiosInstance from "../../axios";

export const getTournamentsByIds = async (desiredTournamentsIds: any) => {
    let result:any = [];
     await axiosInstance().put('/tournaments/Ids', {desiredTournamentsIds: desiredTournamentsIds})
        .then(response => {
            console.log(response);
            console.log(response.data);
            result = response.data;
        })
        .catch(err => {console.log(err)});
     return result;
};
