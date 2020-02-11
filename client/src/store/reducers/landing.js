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
};


const setTournaments = (state, action) => {
    console.log('on fetch now');
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
    console.log(action);
  return updateObject(state, {
      tournamentId: action.tournamentId,
      lastRecordedRound: action.lastRecordedRound,
      selectedTournamentName: action.tournamentName,
      selectedTournamentLeagueId: action.tournamentLeagueId,
      selectedTournamentUsers: action.tournamentUsers,
      selectedTournamentOddsSource: action.tournamentOddsSource
    });
};


const landing = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SET_TOURNAMENTS: return setTournaments(state, action);
        case actionTypes.SET_TOURNAMENT_ID: return setTournamentId(state, action);
        case actionTypes.SET_CREATED_TOURNAMENT: return setCreatedTournament(state, action);
        case actionTypes.SET_CURRENT_TOURNAMENT: return setCurrentTournament(state, action);
        default:
            return state;
    }
};

export default landing;
