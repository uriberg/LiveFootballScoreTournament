import * as actionTypes from './actionsTypes';
import axiosInstance from "../../axios";

export const setTournaments = (tournaments) => {//sync function
    return {
        type: actionTypes.SET_TOURNAMENTS,
        tournamentsArray: tournaments
    };
};

export const fetchTournaments = () => {//async func
    return dispatch => {//available due to redux-thunk
        return axiosInstance().get('/tournaments')
            .then(response => {
                console.log('dispatching...');
                dispatch(setTournaments(response.data));
            })
            .catch(error => {console.log(error);})};
};
