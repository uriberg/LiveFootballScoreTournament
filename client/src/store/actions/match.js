import * as actionTypes from './actionsTypes';
import axiosInstance from "../../axios";
import axios from "axios";
import {headers} from "../../constants/objects";
import {updateMatchScore} from "../../utils/match/updateMatchScore";
import {getBookmakersOdds} from "../../utils/match/getBookmakersOdds";
import {submitOdds} from "../../utils/match/submitOddsToDatabase";
import {setUserToHomeWin} from "../../utils/match/setUserToHomeWin";
import {setUserToAwayWin} from "../../utils/match/setUserToAwayWin";
import {setUserToTieWin} from "../../utils/match/setUserToTieWin";


export const setOdds = (matchOdds, matchId) => {
    console.log(matchId);
    console.log(matchOdds);
    return {
        type: actionTypes.SET_ODDS,
        homeOdd: matchOdds.homeOdd,
        tieOdd: matchOdds.tieOdd,
        awayOdd: matchOdds.awayOdd,
        id: matchId
    };
};

export const setHomeOdd = (homeOdd, matchId) => {
    return {
        type: actionTypes.SET_HOME_ODD,
        homeOdd: homeOdd,
        id: matchId
    };
};

export const setTieOdd = (tieOdd, matchId) => {
    return {
        type: actionTypes.SET_TIE_ODD,
        tieOdd: tieOdd,
        id: matchId
    };
};

export const setAwayOdd = (awayOdd, matchId) => {
    return {
        type: actionTypes.SET_AWAY_ODD,
        awayOdd: awayOdd,
        id: matchId
    };
};

export const setEditMode = (value, matchId) => {
    return {
        type: actionTypes.SET_EDIT_MODE,
        editMode: value,
        id: matchId
    };
};

export const setSelectionChanged = (value, matchId) => {
    return {
        type: actionTypes.SET_SELECTION_CHANGED,
        selectionChanged: value,
        id: matchId
    };
};

export const setUsersChoices = (data, userChoseHome, userChoseTie, userChoseAway, matchId) => {
    console.log(data.homeWinUsers);
    return {
        type: actionTypes.SET_USERS_CHOICES,
        homeWinUsers: data.homeWinUsers,
        tieUsers: data.tieUsers,
        awayWinUsers: data.awayWinUsers,
        userChoseHome: userChoseHome,
        userChoseTie: userChoseTie,
        userChoseAway: userChoseAway,
        id: matchId
    };
};

export const homeIsWinning = (goalsHomeTeam, goalsAwayTeam, matchId) => {
    return {
        type: actionTypes.SET_HOME_IS_WINNING,
        isHomeWin: true,
        isAwayWin: false,
        isTie: false,
        ns: false,
        goalsHomeTeam: goalsHomeTeam,
        goalsAwayTeam: goalsAwayTeam,
        id: matchId
    };
};

export const tieIsWinning = (goalsHomeTeam, goalsAwayTeam, matchId) => {
    return {
        type: actionTypes.SET_TIE_IS_WINNING,
        isHomeWin: false,
        isAwayWin: false,
        isTie: true,
        ns: false,
        goalsHomeTeam: goalsHomeTeam,
        goalsAwayTeam: goalsAwayTeam,
        id: matchId
    };
};

export const awayIsWinning = (goalsHomeTeam, goalsAwayTeam, matchId) => {
    return {
        type: actionTypes.SET_AWAY_IS_WINNING,
        isHomeWin: false,
        isAwayWin: true,
        isTie: false,
        ns: false,
        goalsHomeTeam: goalsHomeTeam,
        goalsAwayTeam: goalsAwayTeam,
        id: matchId
    };
};

export const setFinalResult = (goalsHomeTeam, goalsAwayTeam, matchId) => {
    return {
        type: actionTypes.SET_FINAL_SCORE,
        ns: false,
        ft: true,
        goalsHomeTeam: goalsHomeTeam,
        goalsAwayTeam: goalsAwayTeam,
        isHomeWin: goalsHomeTeam > goalsAwayTeam,
        isTie: goalsHomeTeam === goalsAwayTeam,
        isAwayWin: goalsHomeTeam < goalsAwayTeam,
        id: matchId
    };
};


export const setInitialOdds = (data, tournamentId, matchId) => {
    console.log(data);
    return dispatch => {
        const homeOddIndex = data.homeOdd.findIndex((item) => item.tournamentId === tournamentId);
        const tieOddIndex = data.tieOdd.findIndex((item) => item.tournamentId === tournamentId);
        const awayOddIndex = data.awayOdd.findIndex((item) => item.tournamentId === tournamentId);
        const matchOdds = {
            homeOdd: homeOddIndex > -1 ? data.homeOdd[homeOddIndex].value : '',
            tieOdd: tieOddIndex > -1 ? data.tieOdd[tieOddIndex].value : '',
            awayOdd: awayOddIndex > -1 ? data.awayOdd[awayOddIndex].value : '',
        };
        console.log(matchId);
        dispatch(setOdds(matchOdds, matchId));
    }
};


export const getMatchDetails = (tournamentId, matchId, oddsSource, homeTeamName, awayTeamName) => {//async func
    // console.log(matchId);
    return dispatch => {//available due to redux-thunk
        axiosInstance().get('/matches/' + matchId)
            .then(response => {
                console.log(response);
                if (response.data) {
                    dispatch(setInitialOdds(response.data, tournamentId, matchId));
                    dispatch(setUsersChoices(response.data, false, false, false, matchId));
                    dispatch(getMatchScore(matchId, homeTeamName, awayTeamName));
                }
                if (oddsSource !== 'Manual') {
                    //action creator that builds mostly of util
                    dispatch(getMatchOdds(tournamentId, matchId, oddsSource));
                }
            });

    };
};

export const getMatchScore = (matchId, homeTeamName, awayTeamName) => {
    return (dispatch, getState) => {
        if (!getState().match.matchesById[matchId].ft) {
            // console.log(homeTeamName + ' - ' + awayTeamName + ': fetching....');
            axios.get('https://api-football-v1.p.rapidapi.com/v2/fixtures/id/' + matchId, {headers})
                .then(response => {
                    if (response.data.api.fixtures[0].statusShort !== 'NS') {
                        let goalsHomeTeam = response.data.api.fixtures[0].goalsHomeTeam;
                        let goalsAwayTeam = response.data.api.fixtures[0].goalsAwayTeam;
                        if (goalsHomeTeam > goalsAwayTeam) {
                            //dispatch homeIsWinning
                            dispatch(homeIsWinning(goalsHomeTeam, goalsAwayTeam, matchId));
                        } else if (goalsHomeTeam < goalsAwayTeam) {
                            //dispatch awayIsWining
                            dispatch(awayIsWinning(goalsHomeTeam, goalsAwayTeam, matchId));
                        } else {
                            //dispatch tieIsWinning
                            dispatch(tieIsWinning(goalsHomeTeam, goalsAwayTeam, matchId));
                        }
                        //pure util
                        updateMatchScore(goalsHomeTeam, goalsAwayTeam, matchId);
                    }
                })
                .catch(err => {
                    console.log(err)
                });
        } else {
            console.log('match between ' + homeTeamName + ' and ' + awayTeamName + ' is already in the database!!');
        }
    }
};

export const getMatchOdds = (tournamentId, matchId, oddsSource) => {
    console.log(matchId);
    return dispatch => {
        axios.get('https://api-football-v1.p.rapidapi.com/v2/odds/fixture/' + matchId, {headers})
            .then(response => {
                console.log(response);
                let bookmakers = response.data.api.odds[0].bookmakers;
                const matchOdds = getBookmakersOdds(bookmakers, oddsSource);
                console.log(matchId);
                console.log(matchOdds);
                dispatch(setOdds(matchOdds, matchId));
                //dispatch editMode to be false, then it's a pure util.
                dispatch(setEditMode(false, matchId));
                submitOdds(matchId, matchOdds.homeOdd, matchOdds.tieOdd, matchOdds.awayOdd,
                    tournamentId, oddsSource);
            })
            .catch(err => {
                console.log(err)
            });
    }
};

export const setFinalScore = (matchId, homeGoals, awayGoals, homeTeamName, awayTeamName) => {
    return dispatch => {
        //console.log('HomeGoals: ' + homeGoals);
        //console.log('match between ' + homeTeamName + ' and ' + awayTeamName + ' is over');
        updateMatchScore(+homeGoals, +awayGoals, matchId);
        dispatch(setFinalResult(+homeGoals, +awayGoals, matchId));
    };
};

export const toggleEditMode = (matchId, tournamentId, oddsSource) => {
    return (dispatch, getState) => {
        const editMode = getState().match.matchesById[matchId].editMode;
        if (editMode) {
            const homeOdd = getState().match.matchesById[matchId].homeOdd;
            const tieOdd = getState().match.matchesById[matchId].tieOdd;
            const awayOdd = getState().match.matchesById[matchId].awayOdd;
            if (oddsSource !== 'Manual') {
                if (window.confirm('Are you sure you want to change for these odds?\n' + 'homeOdd: ' + homeOdd + ', tieOdd: ' + tieOdd + 'awayOdd: ' + awayOdd)) {
                    submitOdds(matchId, getState().match.matchesById[matchId].homeOdd, getState().match.matchesById[matchId].tieOdd, getState().match.matchesById[matchId].awayOdd,
                        tournamentId, oddsSource);
                }
            } else {
                submitOdds(matchId, getState().match.matchesById[matchId].homeOdd, getState().match.matchesById[matchId].tieOdd, getState().match.matchesById[matchId].awayOdd,
                    tournamentId, oddsSource);
            }
            dispatch(setEditMode(false, matchId));
        } else {
            dispatch(setEditMode(true, matchId));
        }
    };
};

export const pushUserToHomeWin = (selectedUser, tournamentId, matchId) => {
    return (dispatch, getState) => {
        //util(selectedUser, tournamentId)
        if (selectedUser) {
            //  console.log('selected');
            //console.log(this.props.homeWinUsers);
            let homeWinUsers = [...getState().match.matchesById[matchId].homeWinUsers];
            let awayWinUsers = [...getState().match.matchesById[matchId].awayWinUsers];
            let tieUsers = [...getState().match.matchesById[matchId].tieUsers];

            //util
            const userPushToHomeWin = setUserToHomeWin(tournamentId, selectedUser, homeWinUsers, tieUsers, awayWinUsers);
            console.log(userPushToHomeWin.homeWinUsers);
            //updatechoices
            dispatch(updateUserSelection(matchId, userPushToHomeWin, true, false, false));
        }
    }
};

export const pushUserToAwayWin = (selectedUser, tournamentId, matchId) => {
    return (dispatch, getState) => {
        if (selectedUser) {
            //  console.log('selected');
            //console.log(this.props.homeWinUsers);
            let homeWinUsers = [...getState().match.matchesById[matchId].homeWinUsers];
            let awayWinUsers = [...getState().match.matchesById[matchId].awayWinUsers];
            let tieUsers = [...getState().match.matchesById[matchId].tieUsers];
            const userPushToAwayWin = setUserToAwayWin(tournamentId, selectedUser, homeWinUsers, tieUsers, awayWinUsers);
            //console.log(userPushToAwayWin.awayWinUsers);
            dispatch(updateUserSelection(matchId, userPushToAwayWin, false, false, true));
        }
    }
};

export const pushUserToTie = (selectedUser, tournamentId, matchId) => {
    return (dispatch, getState) => {
        if (selectedUser) {
            //  console.log('selected');
            let homeWinUsers = [...getState().match.matchesById[matchId].homeWinUsers];
            let awayWinUsers = [...getState().match.matchesById[matchId].awayWinUsers];
            let tieUsers = [...getState().match.matchesById[matchId].tieUsers];
            const userPushToTieWin = setUserToTieWin(tournamentId, selectedUser, homeWinUsers, tieUsers, awayWinUsers);
            // console.log(userPushToTieWin.tieUsers);
            dispatch(updateUserSelection(matchId, userPushToTieWin, false, true, false));
        }
    }
};

export const updateUserSelection = (matchId, newChoices, userChoseHome, userChoseTie, userChoseAway) => {
    // console.log(newChoices);
    //console.log(matchId);
    return dispatch => {
        axiosInstance().put('/matches/' + matchId + '/bet', {
            homeWinUsers: newChoices.homeWinUsers,
            awayWinUsers: newChoices.awayWinUsers,
            tieUsers: newChoices.tieUsers
        })
            .then(response => {
                // console.log(response);
                dispatch(setUsersChoices(response.data, userChoseHome, userChoseTie, userChoseAway, matchId));
                dispatch(setSelectionChanged(true, matchId));
            })
            .catch(err => console.log('Error: ' + err));
    }
};

export const insertMatch = (matchId) => {
    //console.log(matchId);
    const newObject = {
        id: matchId,
        selectionChanged: false,
        editMode: false,
        homeOdd: '',
        tieOdd: '',
        awayOdd: '',
        homeWinUsers: [],
        tieUsers: [],
        awayWinUsers: [],
        userChoseHome: false,
        userChoseTie: false,
        userChoseAway: false,
        isTie: false,
        isHomeWin: false,
        isAwayWin: false,
        goalsHomeTeam: -1,
        goalsAwayTeam: -1,
        ns: true,
        ft: false
    };
    return {
        type: actionTypes.INSERT_MATCH,
        id: matchId,
        newMatchObj: newObject
    };
};




