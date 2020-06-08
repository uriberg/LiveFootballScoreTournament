import * as actionTypes from './actionsTypes';
import axiosInstance from "../../axios";
import {setTournamentCreator} from "../../utils/tournament/setTournamentCreator";
import {getTournamentsByIds} from "../../utils/tournament/getTournamentsByIds";

export const setTournaments = (tournaments) => {//sync function
    return {
        type: actionTypes.SET_TOURNAMENTS,
        tournamentsArray: tournaments
    };
};

export const setTournamentId = (id) => {
    return {
        type: actionTypes.SET_TOURNAMENT_ID,
        tournamentId: id
    };
};

export const setCreatedTournament = (newTournament) => {
    return {
        type: actionTypes.SET_CREATED_TOURNAMENT,
        newTournament: newTournament
    };
};

export const setCurrentTournament = (id, data) => {
    //console.log(data);
    return {
        type: actionTypes.SET_CURRENT_TOURNAMENT,
        tournamentId: id,
        lastRecordedRound: data.lastRecordedRound,
        tournamentName: data.tournamentName,
        tournamentLeagueId: data.tournamentLeagueId,
        tournamentUsers: data.tournamentUsers,
        tournamentOddsSource: data.tournamentOddsSource
    };
};

export const clearMatches = () => {
    return {
        type: actionTypes.CLEAR_MATCHES
    };
};

export const clearTournament = () => {
    return {
        type: actionTypes.CLEAR_TOURNAMENT
    };
};

export const clearLanding = () => {
    return {
        type: actionTypes.CLEAR_LANDING
    };
};

export const createTournament = (newTournament, userId) => {
    return dispatch => {
        return axiosInstance().post('/tournaments/newTournament', {newTournament})
            .then(response => {
                console.log('adding tournament');
                dispatch(setTournamentId(response.data._id));
                dispatch(setCreatedTournament(newTournament));
                setTournamentCreator(userId, response.data._id);
            })
            .catch(error => {
                console.log(error)
            });
    };
};

export const getTournament = (id) => {
    console.log('on get torunament action creator');
    return dispatch => {
        return axiosInstance().get('/tournaments/' + id)
            .then(response => {
                console.log(response);
                dispatch(setCurrentTournament(id, response.data));
            })
            .catch(error => {
                console.log(error)
            });
    };
};

export const fetchTournaments = (userId) => {//async func
    console.log(userId);
    return dispatch => {//available due to redux-thunk
        return axiosInstance().get('/users/tournaments/' + userId)
            .then( async response => {
                console.log(response);
                const tournamentsArray = await getTournamentsByIds(response.data);
                console.log(tournamentsArray);
                dispatch(setTournaments(tournamentsArray));
            })
            .catch(error => {
                console.log(error);
            })
    };
};

export const clearStore = () => {
    return dispatch => {
        dispatch(clearMatches());
        dispatch(clearTournament());
        dispatch(clearLanding());
    };
};


