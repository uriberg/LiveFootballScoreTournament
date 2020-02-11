import * as actionTypes from './actionsTypes';
import axiosInstance from "../../axios";

// export const deleteTournament = (tournaments) => {//sync function
//     return {
//         type: actionTypes.SET_TOURNAMENTS,
//         tournamentsArray: tournaments
//     };
// };
export const setMatches = (matches) => {//sync function
    return {
        type: actionTypes.SET_MATCHES,
        currMatches: matches
    };
};


export const getMatches = (tournamentLeagueId, leagueCurrentRound) => {
    return dispatch => {//available due to redux-thunk
        return axiosInstance().get('/matches/' + tournamentLeagueId + '/' + leagueCurrentRound)
            .then(response => {
                console.log('dispatching...');
                dispatch(setMatches(response.data));
            })
            .catch(error => {console.log(error);})};
};

export const deleteTournament = (id) => {//async func
    return dispatch => {//available due to redux-thunk
        return axiosInstance().delete('/tournaments/' + id)
            .then(response => {
                //console.log('tour...');
            })
            .catch(error => {console.log(error);})};
};
