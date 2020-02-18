import * as actionTypes from './actionsTypes';
import axiosInstance from "../../axios";
import {getCurrRound} from '../../utils/getCurrentRound';
import {getCurrRoundMatches} from "../../utils/getCurrRoundMatches";
import {verifyLastRoundHasEnded} from "../../utils/verifyLastRoundHasEnded";
import {updateTournamentRound} from "../../utils/updateTournamentRound";
import {loopUnhandledMatches} from "../../utils/loopUnhandledMatches";
import {updateMatchesScore} from "../../utils/updateMatchesScore";
import {addMissingToTotal} from "../../utils/addMissingToTotal";
import {setCurrentDatabase} from "../../utils/setCurrentDatabase";
import {calculateWeeklyScore} from "../../utils/calculateWeeklyScore";


export const setMatches = (matches) => {//sync function
    return {
        type: actionTypes.SET_MATCHES,
        currMatches: matches
    };
};

export const setCurrentRound = (fixtures) => {
    console.log('dispatching current round');
    return {
        type: actionTypes.SET_CURRENT_ROUND,
        currFixtures: fixtures,
        // desiredPrevRound: this.state.leagueCurrentRound,selector maybe??
        leagueCurrentRound: fixtures[0].round,
    }
};


export const setRoundAndFixtures = (fixtures) => {
    console.log('setting round and fixtures');
    return {
        type: actionTypes.SET_ROUND_AND_FIXTURES,
        leagueCurrentRound: fixtures[0].round,
        currFixtures: fixtures
    }
};

export const setAllMatchesExists = (allMatchesExists) => {
    console.log('AllMatchesExists actionCreator');
    return {
        type: actionTypes.SET_ALL_MATCHES_EXISTS,
        allMatchesExists: allMatchesExists
    }
};

export const setUnhandledMatches = (unhandledMatches) => {
    return {
        type: actionTypes.SET_UNHANDLED_MATCHES,
        unhandledMatches: unhandledMatches
    }
};

export const setUsers = (users) => {
    console.log(users);
    return {
        type: actionTypes.SET_USERS,
        users: users
    }
};


export const getMatches = (tournamentLeagueId, leagueCurrentRound) => {
    return dispatch => {//available due to redux-thunk
        return axiosInstance().get('/matches/' + tournamentLeagueId + '/' + leagueCurrentRound)
            .then(response => {
                console.log('dispatching...');
                dispatch(setMatches(response.data));
            })
            .catch(error => {
                console.log(error);
            })
    };
};

export const deleteTournament = (id) => {//async func
    return dispatch => {//available due to redux-thunk
        return axiosInstance().delete('/tournaments/' + id)
            .then(response => {
                console.log('tournamet with id ' + id + ' has been successfully deleted!');
            })
            .catch(error => {
                console.log(error);
            })
    };
};

export const getCurrentRound = (tournamentId, leagueId, users) => { //async func
    return async dispatch => {
        const apiRound = await getCurrRound(leagueId);
        console.log('is new round: ' + apiRound);
        const apiRoundMatches = await getCurrRoundMatches(apiRound, leagueId);
        console.log(apiRoundMatches);
        const currRoundMatches = await verifyLastRoundHasEnded(apiRoundMatches, apiRound, leagueId);
        console.log(currRoundMatches);
        dispatch(setRoundAndFixtures(currRoundMatches));
        dispatch(checkDatabase(currRoundMatches[0].round, leagueId, tournamentId, users));
    }
};

export const checkDatabase = (currentRound, leagueId, tournamentId, users) => {
    console.log('in check database action creator');
    return (dispatch, getState) => {
        axiosInstance().get('/matches/' + leagueId + '/' + currentRound)
            .then(response => {
                if (response.data.length === 0) {
                    console.log('LENGTH IS ZERO');
                    const updatedScore = updateTournamentRound(users);
                    dispatch(verifyAllMatchesCalculated(leagueId, currentRound, users));
                    const currFixtures = getState().tournament.currFixtures;
                    console.log('currFixtures from selector will now be print');
                    console.log(currFixtures);
                    dispatch(updateCurrentRound(tournamentId, currentRound, updatedScore, currFixtures));
                } else {
                    dispatch(setAllMatchesExists(true));
                    dispatch(setMatches(response.data));
                }
            })
            .catch(error => {console.log(error)});
    }
};

export const verifyAllMatchesCalculated  = (leagueId, currentRound, users) => {
    return dispatch => {
        axiosInstance().get('matches/verify/' + leagueId + '/' + currentRound)
            .then(response => {
                console.log(response);
                dispatch(setUnhandledMatches(response.data));
                const manipulatedResults = loopUnhandledMatches(response.data);
                dispatch(setUnhandledMatches(manipulatedResults));
                const updatedManipulatedResults = updateMatchesScore(manipulatedResults);
                dispatch(setUnhandledMatches(updatedManipulatedResults));
                const updatedUsers = addMissingToTotal(updatedManipulatedResults, users);
                dispatch(updateUsersScore(updatedUsers));
                dispatch(setUnhandledMatches([]));
            })
            .catch(err => {
                console.log('Error ' + err)
            });
    }
};

export const updateUsersScore = (tournamentId, updatedUsers) => {
    return dispatch => {
            axiosInstance().put('/tournaments/' + tournamentId + '/updateUsersScore', {users: updatedUsers})
                .then(response => {
                    console.log(response);
                    dispatch(setUsers(response.data.tournamentUsers));
                })
                .catch(err => {
                    console.log(err)
                });
    }
};

export const updateCurrentRound = (tournamentId, currentRound, updatedScore, fixtures) => {
    return dispatch => {
        axiosInstance().put('tournaments/' + tournamentId + '/updateCurrentRound', {
            newRecordedRound: currentRound,
            updatedTotalScore: updatedScore
        })
            .then(async response => {
                console.log(response);
                console.log('before set current database');
                await setCurrentDatabase(fixtures);
                console.log('after set current database');
                dispatch(setAllMatchesExists(true));
            })
            .catch(err => {
                console.log(err)
            });
    }
};

export const addUser = (tournamentId, users) =>{
    return dispatch => {
        axiosInstance().put('/tournaments/' + tournamentId + '/addUser', {users: users})
            .then(response => {
                console.log(response);
                dispatch(setUsers(response.data.tournamentUsers));
            })
            .catch(err => {
                console.log(err)
            });
    }
};

export const onCalculateWeeklyScore = (tournamentId) => {
    return (dispatch, getState) => {
        let weeklyUsers = calculateWeeklyScore(getState().tournament.users, getState().tournament.currMatches, tournamentId);
        if (weeklyUsers.length > 0) {
            dispatch(updateUsersScore(tournamentId, weeklyUsers));
        }
    }
};
