import * as actionTypes from '../actions/actionsTypes';
import {updateCollection} from "../../shared/utility";

const initialState = {
    matchesById: {}
};

const setOdds = (state, action) => {
    return updateCollection(state, {homeOdd: action.homeOdd, tieOdd: action.tieOdd, awayOdd: action.awayOdd}, action.id, 'matchesById');
};

const setUsersChoice = (state, action) => {
    return updateCollection(state, {
        homeWinUsers: action.homeWinUsers,
        tieUsers: action.tieUsers,
        awayWinUsers: action.awayWinUsers,
        userChoseHome: action.userChoseHome,
        userChoseTie: action.userChoseTie,
        userChoseAway: action.userChoseAway
    }, action.id, 'matchesById');
};

const setCurrentScore = (state, action) => {
  return updateCollection(state, {
      isHomeWin: action.isHomeWin,
      isAwayWin: action.isAwayWin,
      isTie: action.isTie,
      ns: action.ns,
      goalsHomeTeam: action.goalsHomeTeam,
      goalsAwayTeam: action.goalsAwayTeam}, action.id, 'matchesById');
};

const setEditMode = (state, action) => {
    return updateCollection(state, {editMode: action.editMode}, action.id, 'matchesById');
};

const setFinalScore = (state, action) => {
    return updateCollection(state, {
        ns: action.ns,
        ft: action.ft,
        goalsHomeTeam: action.goalsHomeTeam,
        goalsAwayTeam: action.goalsAwayTeam,
        isHomeWin: action.isHomeWin,
        isTie: action.isTie,
        isAwayWin: action.isAwayWin
    }, action.id, 'matchesById');
};

const setHomeOdd = (state, action) => {
    return updateCollection(state, {homeOdd: action.homeOdd}, action.id, 'matchesById');
};

const setTieOdd = (state, action) => {
    return updateCollection(state, {tieOdd: action.tieOdd}, action.id, 'matchesById');
};

const setAwayOdd = (state, action) => {
  return updateCollection(state, {awayOdd: action.awayOdd}, action.id, 'matchesById');
};

const setSelectionChanged = (state, action) => {
    return updateCollection(state, {selectionChanged: action.selectionChanged}, action.id, 'matchesById');
};

const setNewMatch = (state, action) => {
    return {
        ...state,
        matchesById: {
            ...state.matchesById,
            [action.id]: action.newMatchObj
        }
    };
};

const match = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.INSERT_MATCH: return setNewMatch(state, action);
        case actionTypes.SET_ODDS: return setOdds(state, action);
        case actionTypes.SET_USERS_CHOICES: return setUsersChoice(state, action);
        case actionTypes.SET_HOME_IS_WINNING: return setCurrentScore(state, action);
        case actionTypes.SET_AWAY_IS_WINNING: return setCurrentScore(state, action);
        case actionTypes.SET_TIE_IS_WINNING: return setCurrentScore(state, action);
        case actionTypes.SET_EDIT_MODE: return setEditMode(state, action);
        case actionTypes.SET_FINAL_SCORE: return setFinalScore(state, action);
        case actionTypes.SET_HOME_ODD: return setHomeOdd(state, action);
        case actionTypes.SET_TIE_ODD: return setTieOdd(state, action);
        case actionTypes.SET_AWAY_ODD: return setAwayOdd(state, action);
        case actionTypes.SET_SELECTION_CHANGED: return setSelectionChanged(state, action);
        case actionTypes.CLEAR_MATCHES: return {...initialState};
        default:
            return state;
    }
};

export default match;
