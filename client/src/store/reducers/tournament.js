import * as actionTypes from '../actions/actionsTypes';
import {updateObject} from "../../shared/utility";

const initialState = {
   tournamentLeagueId: null,
   leagueCurrentRound: null,
    currMatches: []
};


const setMatches = (state, action) => {
    console.log('set matches in reducer');
    return updateObject(state, {currMatches: action.currMatches});
};

const tournament = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.GET_MATCHES: return setMatches(state, action);
        case actionTypes.SET_MATCHES: return setMatches(state, action);
        default:
            return state;
    }
};

export default tournament;
