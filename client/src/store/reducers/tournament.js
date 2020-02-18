import * as actionTypes from '../actions/actionsTypes';
import {updateObject} from "../../shared/utility";

const initialState = {
    tournamentLeagueId: null,
    leagueCurrentRound: null,
    currMatches: [],
    currFixtures: [],
    desiredPrevRound: '',
    users: [],
    allMatchesExists: false,
    unhandledMatches: [],
    temp: '',
};


const setMatches = (state, action) => {
    console.log('set matches in reducer');
    return updateObject(state, {currMatches: action.currMatches});
};

const setRoundAndMatches = (state, action) => {
  return updateObject(state, {leagueCurrentRound: action.leagueCurrentRound, currFixtures: action.currFixtures});
};

const setAllMatchesExists = (state, action) => {
    return updateObject(state, {allMatchesExists: action.allMatchesExists});
};

const setUnhandledMatches = (state, action) => {
    return updateObject(state, {unhandledMatches: action.unhandledMatches});
};

const setUsers = (state, action) => {
    return updateObject(state, {users: action.users});
};

const tournament = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.GET_MATCHES: return setMatches(state, action);
        case actionTypes.SET_MATCHES: return setMatches(state, action);
        case actionTypes.SET_ROUND_AND_FIXTURES: return setRoundAndMatches(state, action);
        case actionTypes.SET_ALL_MATCHES_EXISTS: return setAllMatchesExists(state, action);
        case actionTypes.SET_UNHANDLED_MATCHES: return setUnhandledMatches(state, action);
        case actionTypes.SET_USERS: return setUsers(state, action);
        default:
            return state;
    }
};

export default tournament;
