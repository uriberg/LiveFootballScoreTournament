import * as actionTypes from '../actions/actionsTypes';
import {updateObject} from "../../shared/utility";

const initialState = {
    tournamentsArray: [],
    tournamentId: '',
    lastRecordedRound: '',
    selectedTournamentName: '',
    selectedTournamentLeagueId: null,
    selectedTournamentUsers: [],
    selectedTournamentOddsSource: '',
    isTournamentAdmin: false,
    userNicknames: [],
    currUserNickname: ''
};


const setTournaments = (state, action) => {
   // console.log('on fetch now');
    return updateObject(state, {tournamentsArray: action.tournamentsArray});
};

const setTournamentId = (state, action) => {
    return updateObject(state, {tournamentId: action.tournamentId});
};

const setCreatedTournament = (state, action) => {
    //maybe I should add the tournament to the tournaments list?
    return updateObject(state, {
        selectedTournamentName: action.newTournament.tournamentName,
        selectedTournamentLeagueId: action.newTournament.tournamentLeagueId,
        selectedTournamentUsers: action.newTournament.tournamentUsers,
        selectedTournamentOddsSource: action.newTournament.tournamentOddsSource
    });
};

const setCurrentTournament = (state, action) => {
    //console.log(action);
    return updateObject(state, {
        tournamentId: action.tournamentId,
        lastRecordedRound: action.lastRecordedRound,
        selectedTournamentName: action.tournamentName,
        selectedTournamentLeagueId: action.tournamentLeagueId,
        selectedTournamentUsers: action.tournamentUsers,
        selectedTournamentOddsSource: action.tournamentOddsSource
    });
};

const checkAdmin = (state, action) => {
    return updateObject(state, {
        isTournamentAdmin: action.isTournamentAdmin
    });
};

const setUserNicknames = (state, action) => {
    return updateObject(state, {
        userNicknames: action.userNicknames
    });
};

const setCurrUserNickname = (state, action) => {
    return updateObject(state, {
        currUserNickname: action.currUserNickname
    });
};

const landing = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SET_TOURNAMENTS:
            return setTournaments(state, action);
        case actionTypes.SET_TOURNAMENT_ID:
            return setTournamentId(state, action);
        case actionTypes.SET_CREATED_TOURNAMENT:
            return setCreatedTournament(state, action);
        case actionTypes.SET_CURRENT_TOURNAMENT:
            return setCurrentTournament(state, action);
        case actionTypes.CHECK_ADMIN:
            return checkAdmin(state, action);
        case actionTypes.SET_USER_NICKNAMES:
            return setUserNicknames(state, action);
        case actionTypes.SET_CURR_USER_NICKNAME:
            return setCurrUserNickname(state, action);
        case actionTypes.CLEAR_LANDING:
            return {...initialState};
        default:
            return state;
    }
};

export default landing;
