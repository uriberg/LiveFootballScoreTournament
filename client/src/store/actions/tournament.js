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


export const setMatches = (matches) => {//sync function
    return {
        type: actionTypes.SET_MATCHES,
        currMatches: matches
    };
};

export const setCurrentRound = (fixtures) => {
   // console.log('dispatching current round');
    return {
        type: actionTypes.SET_CURRENT_ROUND,
        currFixtures: fixtures,
        // desiredPrevRound: this.state.leagueCurrentRound,selector maybe??
        leagueCurrentRound: fixtures[0].round,
    }
};


export const setRoundAndFixtures = (fixtures) => {
   // console.log('setting round and fixtures');
    return {
        type: actionTypes.SET_ROUND_AND_FIXTURES,
        leagueCurrentRound: fixtures[0].round,
        currFixtures: fixtures
    }
};

export const setAllMatchesExists = (allMatchesExists) => {
   // console.log('AllMatchesExists actionCreator');
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
   // console.log(users);
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
           //     console.log('dispatching...');
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
      //  console.log('is new round: ' + apiRound);
        const apiRoundMatches = await getCurrRoundMatches(apiRound, leagueId);
        //console.log(apiRoundMatches);
        const currRoundMatches = await verifyLastRoundHasEnded(apiRoundMatches, apiRound, leagueId);
        //console.log(currRoundMatches);
        dispatch(setRoundAndFixtures(currRoundMatches));
        dispatch(checkDatabase(currRoundMatches[0].round, leagueId, tournamentId, users));
    }
};

export const checkDatabase = (currentRound, leagueId, tournamentId, users) => {
   // console.log('in check database action creator');
    return (dispatch, getState) => {
        axiosInstance().get('/matches/' + leagueId + '/' + currentRound)
            .then(response => {
                if (response.data.length === 0) {
                   // console.log('LENGTH IS ZERO');
                    dispatch(calculateLastWeekScore(tournamentId, leagueId, currentRound, users));
                    const updatedScore = updateTournamentRound(users);
                    dispatch(verifyAllMatchesCalculated(leagueId, currentRound, users));
                    const currFixtures = getState().tournament.currFixtures;
                    //console.log('currFixtures from selector will now be print');
                    //console.log(currFixtures);
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
               // console.log(response);
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
                  //  console.log(response);
                    dispatch(setUsers(response.data.tournamentUsers));
                })
                .catch(err => {
                    console.log(err)
                });
    }
};

export const updateCurrentRound = (tournamentId, currentRound, updatedScore, fixtures) => {
   // console.log(updatedScore);
    return dispatch => {
        axiosInstance().put('tournaments/' + tournamentId + '/updateCurrentRound', {
            newRecordedRound: currentRound
            // updatedTotalScore: updatedScore
        })
            .then(async response => {
               // console.log(response);
                //console.log('before set current database');
                //setUsers???
                await setCurrentDatabase(fixtures);
                //console.log('after set current database');
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
                //console.log(response);
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
       // console.log(weeklyUsers);
        if (weeklyUsers.length > 0) {
       //     console.log('length is greater!!');
            dispatch(updateUsersScore(tournamentId, weeklyUsers));
        }
    }
};

export const calculateLastWeekScore = (tournamentId, leagueId, currentRound, users) => {
  return dispatch => {
      const prevRound = getDesiredPrevRound(currentRound);
     // console.log('last week Round: ' + prevRound);
      axiosInstance().get('/matches/' + leagueId + '/' + prevRound)
          .then(response => {
              if (response.data.length !== 0) {
                //  console.log(response.data);
                 const lastMatches = response.data;
                 let weeklyScore = calculateWeeklyScore(users, lastMatches, tournamentId);
              //   console.log(weeklyScore);
                 let newTotalScore = updateTournamentRound(users);
                 //console.log(newTotalScore);
                 dispatch(updateUsersScore(tournamentId, newTotalScore));
              }
          })
          .catch(error => {console.log(error)});
  };
};
