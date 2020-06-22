import * as actionTypes from './actionsTypes';
import axiosInstance from "../../axios";
import {setTournamentCreator} from "../../utils/tournament/setTournamentCreator";
import {getTournamentsByIds} from "../../utils/tournament/getTournamentsByIds";
import {setUserTournaments} from "../../utils/landing/setUserTournaments";

export const setTournaments = (tournaments) => {//sync function
    return {
        type: actionTypes.SET_TOURNAMENTS,
        tournamentsArray: tournaments
    };
};

export const checkAdmin = (isTournamentAdmin) => {
    return {
        type: actionTypes.CHECK_ADMIN,
        isTournamentAdmin: isTournamentAdmin
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

export const joinTournament = (tournamentSerialNumber, joinedUser) => {
  //  console.log(tournamentSerialNumber);
    //console.log(joinedUser);
    return dispatch => {
        return axiosInstance().put('/tournaments/joinUser/' + tournamentSerialNumber, {joinedUser: joinedUser})
            .then(response => {
              //  console.log(response);
                dispatch(setCurrentTournament(response.data._id, response.data));
                setUserTournaments(response.data._id, joinedUser);
            })
    }
};

export const createTournament = (newTournament, userId, nickname) => {
    return dispatch => {
        return axiosInstance().post('/tournaments/newTournament', {newTournament})
            .then(response => {
               // console.log('adding tournament');
               // console.log(response);
                dispatch(setTournamentId(response.data._id));
                dispatch(setCreatedTournament(newTournament));
                dispatch(checkAdmin(true));
                setTournamentCreator(userId, response.data._id, nickname);
            })
            .catch(error => {
                console.log(error)
            });
    };
};

export const getTournament = (id, currUserId) => {
    //console.log('on get torunament action creator');
    return dispatch => {
        return axiosInstance().get('/tournaments/' + id)
            .then(response => {
              //  console.log(response);
                dispatch(setCurrentTournament(id, response.data));
                let isTournamentAdmin = false;
                if (currUserId === response.data.tournamentCreator){
                    isTournamentAdmin = true;
                }
                dispatch(checkAdmin(isTournamentAdmin));
            })
            .catch(error => {
                console.log(error)
            });
    };
};

export const setUserNicknames = (nicknamesList) => {
    return {
        type: actionTypes.SET_USER_NICKNAMES,
        userNicknames: nicknamesList
    };
};

export const fetchTournaments = (userId) => {//async func
    //console.log(userId);
    return dispatch => {//available due to redux-thunk
        return axiosInstance().get('/users/tournaments/' + userId)
            .then( async response => {
      //          console.log('NOT RESPONSE OF FETCH');
        //        console.log(response);
                dispatch(setUserNicknames(response.data));
                const tournamentsArray = await getTournamentsByIds(response.data);
          //      console.log(tournamentsArray);
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


