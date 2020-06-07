import * as actionTypes from './actionsTypes';
import axiosInstance from "../../axios";

export const login = (name, id) => {
    return dispatch => {
        return axiosInstance().get('/users/' + id)
            .then(response => {
                console.log(response);
                if (response.data === null){
                    console.log('user is null');
                    console.log(id);
                    dispatch(addUser(name, id));
                }
                //dispatch(setCurrentTournament(id, response.data));
            })
            .catch(error => {
                console.log(error)
            });
    };
}

export const addUser = (name, id) => {
    return dispatch => {
        return axiosInstance().post('/users/addUser', {name: name, id: id})
            .then(response => {
                console.log(response);
                //dispatch(setCurrentTournament(id, response.data));
            })
            .catch(error => {
                console.log(error)
            });
    };
}

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

export const createTournament = (newTournament) => {
    return dispatch => {
        return axiosInstance().post('/tournaments/newTournament', {newTournament})
            .then(response => {
                console.log('adding tournament');
                dispatch(setTournamentId(response.data._id));
                dispatch(setCreatedTournament(newTournament));
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

export const fetchTournaments = () => {//async func
    return dispatch => {//available due to redux-thunk
        return axiosInstance().get('/tournaments')
            .then(response => {
                //   console.log('dispatching...');
                dispatch(setTournaments(response.data));
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


