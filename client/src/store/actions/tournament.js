import * as actionTypes from './actionsTypes';
import axiosInstance from "../../axios";
import {getCurrRound} from '../../utils/tournament/getCurrentRound';
import {getCurrRoundMatches} from "../../utils/tournament/getCurrRoundMatches";
import {verifyLastRoundHasEnded} from "../../utils/tournament/verifyLastRoundHasEnded";
import {updateTournamentRound} from "../../utils/tournament/updateTournamentRound";
import {loopUnhandledMatches} from "../../utils/tournament/loopUnhandledMatches";
import {updateMatchesScore} from "../../utils/tournament/updateMatchesScore";
import {addMissingToTotal} from "../../utils/tournament/addMissingToTotal";
import {setCurrentDatabase} from "../../utils/tournament/setCurrentDatabase";
import {calculateWeeklyScore} from "../../utils/tournament/calculateWeeklyScore";
import {getDesiredPrevRound} from "../../utils/tournament/verifyLastRoundHasEnded";
import {getTournamentCalculatedMatches} from "../../utils/tournament/getTournamentCalculatedMatches";
import {getTournament} from "../../utils/tournament/getTournament";
import {sumScoreForFinishedMatches} from "../../utils/tournament/sumScoreForFinishedMatches";
import axios from "axios";
import {headers} from "../../constants/objects";
import {updateMatchScore} from "../../utils/match/updateMatchScore";
import {setMatchStatus} from "../../utils/match/setMatchStatus";
import {setCalculatedMatches} from "../../utils/tournament/setCalculatedMatches";
import {DEBUG} from "../../constants/settings";


export const setMatches = (matches) => {//sync function
    return {
        type: actionTypes.SET_MATCHES,
        currMatches: matches
    };
};

export const updateCalculatedMatches = (calculatedMatches) => {
    return {
        type: actionTypes.SET_CALCULATED_MATCHES,
        calculatedMatches: calculatedMatches
    };
};

export const setCurrentRound = (fixtures) => {
    // DEBUG && console.log('dispatching current round');
    return {
        type: actionTypes.SET_CURRENT_ROUND,
        currFixtures: fixtures,
        // desiredPrevRound: this.state.leagueCurrentRound,selector maybe??
        leagueCurrentRound: fixtures[0].round,
    }
};


export const setRoundAndFixtures = (fixtures) => {
    // DEBUG && console.log('setting round and fixtures');
    return {
        type: actionTypes.SET_ROUND_AND_FIXTURES,
        leagueCurrentRound: fixtures[0].round,
        currFixtures: fixtures
    }
};

export const setAllMatchesExists = (allMatchesExists) => {
    // DEBUG && console.log('AllMatchesExists actionCreator');
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
    // DEBUG && console.log(users);
    return {
        type: actionTypes.SET_USERS,
        users: users
    }
};


export const reverseUsers = () => {
    return {
        type: actionTypes.REVERSE_USERS
    }
};

export const sortUsers = (clickedColumn) => {
    return {
        type: actionTypes.SORT_BY_USERS,
        clickedColumn: clickedColumn
    };
};


export const getMatches = (tournamentLeagueId, leagueCurrentRound) => {
    return dispatch => {//available due to redux-thunk
        return axiosInstance().get('/matches/' + tournamentLeagueId + '/' + leagueCurrentRound)
            .then(response => {
                //     DEBUG && console.log('dispatching...');
                dispatch(setMatches(response.data));
            })
            .catch(error => {
                DEBUG && console.log(error);
            })
    };
};

export const deleteTournament = (id) => {//async func
    return dispatch => {//available due to redux-thunk
        return axiosInstance().delete('/tournaments/' + id)
            .then(response => {
                DEBUG && console.log('tournamet with id ' + id + ' has been successfully deleted!');
            })
            .catch(error => {
                DEBUG && console.log(error);
            })
    };
};

export const getCurrentRound = (tournamentId, leagueId, users) => { //async func
    return async dispatch => {
        const apiRound = await getCurrRound(leagueId);
        //  DEBUG && console.log('is new round: ' + apiRound);
        const apiRoundMatches = await getCurrRoundMatches(apiRound, leagueId);
        //DEBUG && console.log(apiRoundMatches);
        const currRoundMatches = await verifyLastRoundHasEnded(apiRoundMatches, apiRound, leagueId);
        //DEBUG && console.log(currRoundMatches);
        dispatch(setRoundAndFixtures(currRoundMatches));
        dispatch(checkDatabase(currRoundMatches[0].round, leagueId, tournamentId, users));
    }
};

export const checkDatabase = (currentRound, leagueId, tournamentId, users) => {
    // DEBUG && console.log('in check database action creator');
    return (dispatch, getState) => {
        axiosInstance().get('/matches/' + leagueId + '/' + currentRound)
            .then(response => {
                if (response.data.length === 0) {
                    DEBUG && console.log('LENGTH IS ZERO');

                    //  dispatch(calculateLastWeekScore(tournamentId, leagueId, currentRound, users));
                    //  const updatedScore = updateTournamentRound(users);
                    //  dispatch(verifyAllMatchesCalculated(leagueId, currentRound, users));

                    const currFixtures = getState().tournament.currFixtures;
                    //DEBUG && console.log('currFixtures from selector will now be print');
                    //DEBUG && console.log(currFixtures);
                    dispatch(updateCurrentRound(tournamentId, currentRound, currFixtures));
                } else {
                    dispatch(setAllMatchesExists(true));
                    dispatch(setMatches(response.data));
                }
            })
            .catch(error => {
                DEBUG && console.log(error)
            });
    }
};

export const verifyAllMatchesCalculated = (leagueId, currentRound, users) => {
    return dispatch => {
        axiosInstance().get('matches/verify/' + leagueId + '/' + currentRound)
            .then(response => {
                // DEBUG && console.log(response);
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
                DEBUG && console.log('Error ' + err)
            });
    }
};

export const updateUsersScore = (tournamentId, updatedUsers) => {
    return dispatch => {
        axiosInstance().put('/tournaments/' + tournamentId + '/updateUsersScore', {users: updatedUsers})
            .then(response => {
                //  DEBUG && console.log(response);
                dispatch(setUsers(response.data.tournamentUsers));
            })
            .catch(err => {
                DEBUG && console.log(err)
            });
    }
};

export const updateCurrentRound = (tournamentId, currentRound, fixtures) => {
    DEBUG && console.log('updatr Current)');
    return dispatch => {
        axiosInstance().put('tournaments/' + tournamentId + '/updateCurrentRound', {
            newRecordedRound: currentRound
            // updatedTotalScore: updatedScore
        })
            .then(async response => {
                // DEBUG && console.log(response);
                //DEBUG && console.log('before set current database');
                //setUsers???
                DEBUG && console.log('in updateCurrent Round');
                await setCurrentDatabase(fixtures);
                //DEBUG && console.log('after set current database');
                dispatch(setAllMatchesExists(true));
            })
            .catch(err => {
                DEBUG && console.log(err)
            });
    }
};

export const addUser = (tournamentId, users) => {
    return dispatch => {
        axiosInstance().put('/tournaments/' + tournamentId + '/addUser', {users: users})
            .then(response => {
                //DEBUG && console.log(response);
                dispatch(setUsers(response.data.tournamentUsers));
            })
            .catch(err => {
                DEBUG && console.log(err)
            });
    }
};

export const onCalculateWeeklyScore = (tournamentId) => {
    return (dispatch, getState) => {
        let weeklyUsers = calculateWeeklyScore(getState().tournament.users, getState().tournament.currMatches, tournamentId);
        // DEBUG && console.log(weeklyUsers);
        if (weeklyUsers.length > 0) {
            //     DEBUG && console.log('length is greater!!');
            dispatch(updateUsersScore(tournamentId, weeklyUsers));
        }
    }
};

export const calculateLastWeekScore = (tournamentId, leagueId, currentRound, users) => {
    return dispatch => {
        const prevRound = getDesiredPrevRound(currentRound);
        // DEBUG && console.log('last week Round: ' + prevRound);
        axiosInstance().get('/matches/' + leagueId + '/' + prevRound)
            .then(response => {
                if (response.data.length !== 0) {
                    //  DEBUG && console.log(response.data);
                    const lastMatches = response.data;
                    let weeklyScore = calculateWeeklyScore(users, lastMatches, tournamentId);
                    //   DEBUG && console.log(weeklyScore);
                    let newTotalScore = updateTournamentRound(users);
                    //DEBUG && console.log(newTotalScore);
                    dispatch(updateUsersScore(tournamentId, newTotalScore));
                }
            })
            .catch(error => {
                DEBUG && console.log(error)
            });
    };
};

export const calculateTotalScore = (tournamentId, leagueId) => {
    return dispatch => {
        axiosInstance().get('/matches/leagueId/' + leagueId)
            .then(async response => {
                if (response.data.length !== 0) {
                    DEBUG && console.log(response.data);
                    const leagueMatches = response.data;
                    let unhandledMatches = [];
                    //after round is over
                    for (let i = 0; i < leagueMatches.length; i++) {
                        if (leagueMatches[i].statusShort !== 'FT') {
                            DEBUG && console.log(leagueMatches[i]);
                            let op = axios.get('https://api-football-v1.p.rapidapi.com/v2/fixtures/id/' + leagueMatches[i]._id, {headers})
                            unhandledMatches.push(op);
                        }
                    }

                    let res = await axios.all(unhandledMatches);
                    DEBUG && console.log(res.length);
                    let matchTemp = [];
                    for (let i = 0; i < res.length; i++) {
                        let goalsHomeTeam = res[i].data.api.fixtures[0].goalsHomeTeam;
                        let goalsAwayTeam = res[i].data.api.fixtures[0].goalsAwayTeam;
                        let matchId = res[i].data.api.fixtures[0].fixture_id;
                        let pending1 = await updateMatchScore(goalsHomeTeam, goalsAwayTeam, matchId);
                        if (res[i].data.api.fixtures[0].statusShort === "FT") {
                            let pending2 = await setMatchStatus(matchId, "FT");
                        }
                        matchTemp.push(pending1);
                    }

                    await axios.all(matchTemp).then(dispatch(sumCalculateScore(tournamentId, leagueId)));
                    DEBUG && console.log(res);
                }
            })
    };
};

export const sumCalculateScore = (tournamentId, leagueId) => {
    return (dispatch, getState) => {
        DEBUG && console.log('in sum calculate');
        axiosInstance().get('/matches/leagueId/' + leagueId)
            .then(async response => {
                DEBUG && console.log(response.data);
                if (response.data.length !== 0) {
                    DEBUG && console.log(response.data);
                    const leagueMatches = response.data;
                    const tournament = await getTournament(tournamentId);
                    const tournamentCalculatedMatches = tournament.calculatedMatches;
                    let matchesToCalculate = [];
                    for (let j = 0; j < leagueMatches.length; j++) {
                        if (leagueMatches[j].statusShort === 'FT') {
                            DEBUG && console.log('match has ended');
                        }
                        if (leagueMatches[j].createdAt.localeCompare(tournament.createdAt) === 1 &&
                            (tournamentCalculatedMatches.findIndex((item) =>
                                item._id === leagueMatches[j]._id
                            ) === -1) && leagueMatches[j].statusShort === 'FT') {
                            matchesToCalculate.push(leagueMatches[j]);
                        }
                    }

                    DEBUG && console.log(matchesToCalculate);
                    const result = sumScoreForFinishedMatches(getState().tournament.users, matchesToCalculate, tournamentId);
                    let updatedCalculatedMatches = tournament.calculatedMatches;
                    for(let i = 0; i < matchesToCalculate.length; i++){
                        updatedCalculatedMatches.push(matchesToCalculate[i]);
                    }
                    DEBUG && console.log(updatedCalculatedMatches);
                    setCalculatedMatches(tournamentId, updatedCalculatedMatches);
                    dispatch(updateCalculatedMatches(updatedCalculatedMatches));
                    DEBUG && console.log(result);
                }
            });
    };
};
