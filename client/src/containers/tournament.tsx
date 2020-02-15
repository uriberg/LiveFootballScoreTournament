import React, {Component} from 'react';
import axios from 'axios';
import axiosInstance from '../axios';
import Match from "./match";
import {Button, Form, Menu, Select, Responsive} from "semantic-ui-react";
import classes from './tournament.module.css';
import _ from 'lodash';
import {connect} from 'react-redux';
import * as actions from '../store/actions/index';
import {User, MatchType} from '../constants/interfaces';
import {headers} from "../constants/objects";
import TournamentTable from "../components/tournamentTable";
import TournamentMenu from "../components/tournamentMenu";
import AddUserForm from "../components/addUserForm";

interface PropsFromDispatch {
    onDeleteTournament: (id: string) => void,
    getMatches: (tournamentLeagueId: number, leagueCurrentRound: string) => void,
    setMatches: (matches: any) => void
}

interface PropsFromState {
    currMatches: []
}

interface TournamentProps {
    tournamentName: string,
    tournamentLeagueId: number,
    users: User [],
    tournamentId: string,
    lastRecordedRound: string,
    oddsSource: string,
    backHome: () => void
}

type AllProps = PropsFromDispatch & TournamentProps & PropsFromState;

class Tournament extends Component<AllProps> {
    private weeklyScoreinterval: number | undefined;
    private currMatchesInterval: number | undefined;
    private usersInterval: number | undefined;
    private checkRoundInterval: number | undefined;


    state = {
        usernameToAddName: '',
        usernameToAddScore: 0,
        editMode: false,
        direction: 'descending',
        column: undefined,

        users: [] = [],
        currFixtures: [],
        selectedUser: '',
        leagueCurrentRound: '',
        desiredPrevRound: '',
        unhandledMatches: [],
        allMatchesExists: false
    };

    componentDidMount() {
        this.getCurrentRound(this.props.tournamentLeagueId);
        let tempUsers = [...this.props.users];
        this.setState({users: tempUsers});
        this.calculateWeeklyScore();

        // @ts-ignore
        this.currMatchesInterval = setInterval(() => {
            this.getMatches();
        }, 5000);
        // @ts-ignore
        this.weeklyScoreinterval = setInterval(() => {
            this.calculateWeeklyScore();
        }, 10000);

        // @ts-ignore
        this.checkRoundInterval = setInterval(() => {
            this.getCurrentRound(this.props.tournamentLeagueId);
        }, 120000);//i.e every two minutes
    }

    componentWillUnmount(): void {
        clearInterval(this.weeklyScoreinterval);
        clearInterval(this.currMatchesInterval);
        clearInterval(this.usersInterval);
        clearInterval(this.checkRoundInterval);
    }

    //redux - tournament
    getCurrentRound = (leagueId: number) => {
        axios.get('https://api-football-v1.p.rapidapi.com/v2/fixtures/rounds/' + leagueId + '/current', {headers})
            .then(response => {
                // console.log(response.data.api.fixtures[0]);
                let currentRound = response.data.api.fixtures[0];
                //let currentRound = 'Regular_Season_-_22';
                console.log(currentRound);
                //this.setState({leagueCurrentRound: currentRound, desiredPrevRound: currentRound});
                this.getCurrRoundMatches(currentRound);
            })
            .catch(err => console.log(err));
    };

    //tournament redux
    getCurrRoundMatches = (currentRound: string) => {
        //  console.log(this.state.leagueCurrentRound);
        console.log('currRoundMatches');
        console.log(this.state.leagueCurrentRound);
        axios.get('https://api-football-v1.p.rapidapi.com/v2/fixtures/league/' + this.props.tournamentLeagueId + '/' + currentRound, {headers})
            .then(response => {
                console.log(response);
                this.verifyLastRoundHasEnded(response.data.api.fixtures, currentRound);
            })
            .catch(err => console.log(err));
    };

    //tournament redux
    verifyLastRoundHasEnded = (fixtures: any, currentRound: string) => {
        console.log(fixtures);
        let roundHasEnded = true;
        let desiredPrevRound = this.desiredPrevRound(currentRound);
        let firstNewMatch = this.getClosestNewRoundMatch(fixtures);
        console.log(desiredPrevRound);
        console.log(firstNewMatch);
        //  console.log(this.state.leagueCurrentRound);
        console.log('currRoundMatches');
        console.log(this.state.leagueCurrentRound);
        axios.get('https://api-football-v1.p.rapidapi.com/v2/fixtures/league/' + this.props.tournamentLeagueId + '/' + desiredPrevRound, {headers})
            .then(response => {
                let lastFixtures = response.data.api.fixtures;
                console.log(lastFixtures);
                for (let i = 0; i < lastFixtures.length; i++) {
                    if (lastFixtures[i].statusShort !== 'FT') {
                        if (lastFixtures[i].event_date.localeCompare(firstNewMatch) === -1) {
                            console.log('Round not ended! ' + lastFixtures[i]);
                            roundHasEnded = false;
                            break;
                        }
                    }
                }
                if (roundHasEnded) {
                    //redux functions for all vars
                    this.setState({
                        currFixtures: fixtures,
                        desiredPrevRound: this.state.leagueCurrentRound,
                        leagueCurrentRound: fixtures[0].round,
                        //leagueCurrentRound: 'Regular Season - 22',
                    });
                    this.checkDatabase(fixtures[0].round);
                } else {
                    //redux functions for all vars
                    this.setState({
                        leagueCurrentRound: lastFixtures[0].round,
                        currFixtures: lastFixtures
                    });
                    this.checkDatabase(lastFixtures[0].round);
                }
            })
            .catch(err => {
                console.log(err)
            });
        // for(let i = 0; i < fixtures.length; i++){
        // }
    };

    getClosestNewRoundMatch = (fixtures: any) => {
        let firstEvent = fixtures[0].event_date;
        for (let i = 1; i < fixtures.length; i++) {
            if (firstEvent.localeCompare(fixtures[i].event_date) === 1) {
                firstEvent = fixtures[i].event_date;
            }
        }
        return firstEvent;
    };

    checkDatabase = (currentRound: string) => {
        console.log(this.props.tournamentLeagueId);
        console.log(this.state.leagueCurrentRound);
        axiosInstance().get('/matches/' + this.props.tournamentLeagueId + '/' + currentRound)
            .then(response => {
                console.log(response);
                console.log(this.state.leagueCurrentRound);
                if (response.data.length === 0) {
                    console.log('LENGTH IS ZERO');
                    this.updateTournamentRound();
                } else {
                    this.setState({allMatchesExists: true});
                    this.props.setMatches(response.data);
                }
                //this.setState({currMatches: response.data});
            })
            .catch(err => {
                console.log(err)
            });
    };

    updateTournamentRound = () => {
        let updatedScore = [...this.state.users];
        console.log(updatedScore);
        for (let i = 0; i < updatedScore.length; i++) {
            // @ts-ignore
            updatedScore[i].totalScore = updatedScore[i].totalScore + updatedScore[i].weeklyScore;
            // @ts-ignore
            updatedScore[i].weeklyScore = 0;
        }
        this.verifyAllMatchesCalculated();
        console.log(updatedScore);
        axiosInstance().put('tournaments/' + this.props.tournamentId + '/updateCurrentRound', {
            newRecordedRound: this.state.leagueCurrentRound,
            updatedTotalScore: updatedScore
        })
            .then(response => {
                console.log(response);
                this.setCurrentDatabase();
            })
            .catch(err => {
                console.log(err)
            });
    };


    deleteTournament = async () => {
        if (window.confirm("Do you want to delete " + this.props.tournamentName + '?') === true) {
            await this.props.onDeleteTournament(this.props.tournamentId);
            this.props.backHome();
        }
    };

    desiredPrevRound = (currentRound: string) => {
        //let currentPrevRound = this.state.desiredPrevRound;
        let currentPrevRound = currentRound;
        let currentPrevRoundNumber = '';
        let newPrevRoundNumber = '';
        let firstNumberIndex = -1;
        for (let i = 0; i < currentPrevRound.length; i++) {

            if (currentPrevRound.charAt(i) >= '0' && currentPrevRound.charAt(i) <= '9') {
                if (firstNumberIndex < 0) {
                    firstNumberIndex = i;
                } else {
                }
                console.log(currentPrevRound.charAt(i));
                currentPrevRoundNumber = currentPrevRoundNumber + currentPrevRound.charAt(i);
                console.log(currentPrevRoundNumber);
            }
        }
        newPrevRoundNumber = +(currentPrevRoundNumber) - 1 + '';
        console.log(newPrevRoundNumber);
        const newDesiredPrevRound = currentRound.substring(0, firstNumberIndex) + newPrevRoundNumber;
        console.log(newDesiredPrevRound);
        this.setState({desiredPrevRound: newDesiredPrevRound});
        return newDesiredPrevRound;
    };

    getMatches = () => {
        if (this.props.tournamentLeagueId && this.state.leagueCurrentRound) {
            this.props.getMatches(this.props.tournamentLeagueId, this.state.leagueCurrentRound);
        }
    };


    verifyAllMatchesCalculated = () => {
        axiosInstance().get('matches/verify/' + this.props.tournamentLeagueId + '/' + this.state.leagueCurrentRound)
            .then(response => {
                console.log(response);
                this.setState({unhandledMatches: response.data});
                this.loopUnhandledMatches();
            })
            .catch(err => {
                console.log('Error ' + err)
            });
    };

    //matches redux
    loopUnhandledMatches = () => {
        console.log(this.state.unhandledMatches);
        let promises = [];
        for (let i = 0; i < this.state.unhandledMatches.length; i++) {
            // @ts-ignore
            let matchId = this.state.unhandledMatches[i]._id;
            promises.push(axios.get('https://api-football-v1.p.rapidapi.com/v2/fixtures/id/' + matchId, {headers}));
        }

        axios.all(promises).then((results) => {
            console.log('NOW RESULT: ', results);
            console.log(this.state.unhandledMatches);
            let manipulatedResults = [];
            for (let i = 0; i < results.length; i++) {
                manipulatedResults.push(results[i].data.api.fixtures[0]);
            }
            this.setState({unhandledMatches: manipulatedResults});
            this.updateMatchesScore();
        });
    };

    addMissingToTotal = () => {
        let unhandledMatches: MatchType [] = [...this.state.unhandledMatches];
        console.log(unhandledMatches);
        //console.log(unhandledMatches[0].goalsHomeTeam);
        let users: User [] = [...this.state.users];
        console.log(unhandledMatches);
        for (let m = 0; m < users.length; m++) {
            for (let k = 0; k < unhandledMatches.length; k++) {
                if (unhandledMatches[k].goalsHomeTeam > unhandledMatches[k].goalsAwayTeam) {
                    console.log('the result is home win with odd: ' + unhandledMatches[k].homeOdd);
                    // @ts-ignore
                    if (unhandledMatches[k].homeWinUsers.indexOf(users[m].name) > -1) {
                        console.log('Add  ' + unhandledMatches[k].homeOdd + ' to ' + users[m].name);
                        // @ts-ignore
                        users[m].totalScore = +parseFloat((users[m].totalScore + unhandledMatches[k].homeOdd).toFixed(2));

                    }
                } else if (unhandledMatches[k].goalsHomeTeam < unhandledMatches[k].goalsAwayTeam) {
                    console.log('the result is away win with odd: ' + unhandledMatches[k].awayOdd);
                    // @ts-ignore
                    if (unhandledMatches[k].awayWinUsers.indexOf(users[m].name) > -1) {
                        console.log('Add  ' + unhandledMatches[k].awayOdd + ' to ' + users[m].name);
                        users[m].totalScore = +parseFloat((users[m].totalScore + unhandledMatches[k].awayOdd).toFixed(2));
                    }
                } else if (unhandledMatches[k].goalsHomeTeam === unhandledMatches[k].goalsAwayTeam) {
                    console.log('the result is a tie with odd: ' + unhandledMatches[k].tieOdd);
                    // @ts-ignore
                    if (unhandledMatches[k].tieUsers.indexOf(users[m].name) > -1) {
                        console.log('Add  ' + unhandledMatches[k].tieOdd + ' to ' + users[m].name);
                        users[m].totalScore = +parseFloat((users[m].totalScore + unhandledMatches[k].tieOdd).toFixed(2));
                    }
                }
            }
        }
        console.log(users);
        this.updateUsersScore(users);
        this.setState({unhandledMatches: []});
    };

    //matches redux
    updateMatchesScore = () => {
        let unhandledMatches: MatchType [] = [...this.state.unhandledMatches];
        let promises = [];
        console.log(unhandledMatches);
        for (let i = 0; i < unhandledMatches.length; i++) {
            // @ts-ignore
            let matchId = unhandledMatches[i].fixture_id;
            let goalsHomeTeam = unhandledMatches[i].goalsHomeTeam;
            let goalsAwayTeam = unhandledMatches[i].goalsAwayTeam;
            promises.push(axiosInstance().put('/matches/' + matchId + '/result', {
                goalsHomeTeam: goalsHomeTeam,
                goalsAwayTeam: goalsAwayTeam
            }));
        }
        axios.all(promises).then((results) => {
            console.log('NOW RESULT: ', results);
            console.log(this.state.unhandledMatches);
            let manipulatedResults = [];
            for (let i = 0; i < results.length; i++) {
                manipulatedResults.push(results[i].data);
            }
            this.setState({unhandledMatches: manipulatedResults});
            this.addMissingToTotal();
        });
    };

    setCurrentDatabase = () => {
        let promises = [];
        for (let i = 0; i < this.state.currFixtures.length; i++) {

            // @ts-ignore
            let matchId = this.state.currFixtures[i].fixture_id;
            // @ts-ignore
            let homeTeamName = this.state.currFixtures[i].homeTeam.team_name;
            // @ts-ignore
            let awayTeamName = this.state.currFixtures[i].awayTeam.team_name;
            // @ts-ignore
            let currentRound = this.state.currFixtures[i].round;
            // console.log(currentRound);
            // @ts-ignore
            let leagueId = this.state.currFixtures[i].league_id;

            //this.addMatch(matchId, homeTeamName, awayTeamName, currentRound, leagueId, i);
            promises.push(axiosInstance().post('/matches/add', {
                matchId: matchId,
                homeTeamName: homeTeamName,
                awayTeamName: awayTeamName,
                round: currentRound,
                leagueId: leagueId
            }));
        }
        axios.all(promises).then((results) => {
            this.setState({allMatchesExists: true});
        })
            .catch(err => {
                console.log(err)
            });
    };


    selectedUserChanged = (event: any, {value}: any) => {
        console.log(event);
        this.setState({selectedUser: value});
    };

    newUserScoreChanged = ({currentTarget: {value}}: React.SyntheticEvent<HTMLInputElement>) => {
        this.setState({usernameToAddScore: value});
    };

    newUsernameChanged = ({currentTarget: {value}}: React.SyntheticEvent<HTMLInputElement>) => {
        this.setState({usernameToAddName: value});
    };

    addUser = () => {
        let users: User [] = [...this.state.users];
        const newUser = {
            name: this.state.usernameToAddName,
            totalScore: this.state.usernameToAddScore,
            weeklyScore: 0
        };
        users.push(newUser);
        axiosInstance().put('/tournaments/' + this.props.tournamentId + '/addUser', {users: users})
            .then(response => {
                console.log(response);
                this.setState({users: response.data.tournamentUsers, usernameToAddName: '', usernameToAddScore: 0});
            })
            .catch(err => {
                console.log(err)
            });
    };

    calculateWeeklyScore = () => {
        let users: User [] = [...this.state.users];
        let matches: MatchType [] = [...this.props.currMatches];
        console.log(matches);
        for (let i = 0; i < users.length; i++) {
            users[i].weeklyScore = 0;

            for (let j = 0; j < matches.length; j++) {
                if (matches[j].goalsHomeTeam !== null) {
                    let homeOddIndex = matches[j].homeOdd.findIndex((item: any) => item.tournamentId === this.props.tournamentId);
                    let tieOddIndex = matches[j].tieOdd.findIndex((item: any) => item.tournamentId === this.props.tournamentId);
                    let awayOddIndex = matches[j].awayOdd.findIndex((item: any) => item.tournamentId === this.props.tournamentId);
                    if (homeOddIndex > -1 && tieOddIndex > -1 && awayOddIndex > -1) {//i.e odds have been submitted
                        if (matches[j].goalsHomeTeam > matches[j].goalsAwayTeam) {
                            // @ts-ignore
                            if (matches[j].homeWinUsers.findIndex((item: any) => item.name === users[i].name && item.tournamentId === this.props.tournamentId) > -1) {
                                users[i].weeklyScore = +parseFloat((users[i].weeklyScore + matches[j].homeOdd[homeOddIndex].value).toFixed(2));
                            }
                        } else if (matches[j].goalsHomeTeam < matches[j].goalsAwayTeam) {
                            // @ts-ignore
                            if (matches[j].awayWinUsers.findIndex((item: any) => item.name === users[i].name && item.tournamentId === this.props.tournamentId) > -1) {
                                users[i].weeklyScore = +parseFloat((users[i].weeklyScore + matches[j].awayOdd[awayOddIndex].value).toFixed(2));
                            }
                        } else if (matches[j].goalsHomeTeam === matches[j].goalsAwayTeam) {
                            // @ts-ignore
                            if (matches[j].tieUsers.findIndex((item: any) => item.name === users[i].name && item.tournamentId === this.props.tournamentId) > -1) {
                                users[i].weeklyScore = +parseFloat((users[i].weeklyScore + matches[j].tieOdd[tieOddIndex].value).toFixed(2));
                            }
                        }
                    }
                }
            }
        }
        if (users.length > 0) {
            this.updateUsersScore(users);
        }
    };

    //pure redux
    updateUsersScore = (users: any) => {
        axiosInstance().put('/tournaments/' + this.props.tournamentId + '/updateUsersScore', {users: users})
            .then(response => {
                console.log(response);
                this.setState({users: response.data.tournamentUsers});
            })
            .catch(err => {
                console.log(err)
            });
    };

    handleSort = (clickedColumn: any) => () => {
        let users = [...this.state.users];

        if (this.state.column !== clickedColumn) {
            this.setState({
                column: clickedColumn,
                users: _.sortBy(users, [clickedColumn]),
                direction: 'ascending',
            });

            return
        }

        this.setState({
            users: users.reverse(),
            direction: this.state.direction === 'ascending' ? 'descending' : 'ascending',
        })
    };

    toggleEditMode = () => {
        this.setState((prevState: any) => ({
            editMode: !prevState.editMode
        }));
    };


    render() {
        const participants = this.state.users.map((user: User) => ({
            key: user.name,
            value: user.name,
            text: user.name
        }));
        const usersList: User [] = [...this.state.users];
        const direction = this.state.direction;

        return (
            <div>
                <div style={{display: 'flex', justifyContent: 'center'}}>
                    <Responsive {...Responsive.onlyMobile}>
                        <TournamentMenu onBackHome={this.props.backHome} onToggleEditMode={this.toggleEditMode}
                                        onDeleteTournament={this.deleteTournament}
                                        onSelectedUserChanged={this.selectedUserChanged} participants={participants}/>
                    </Responsive>
                </div>

                <div className={classes.desktopMenu}>
                    <Responsive minWidth={Responsive.onlyTablet.minWidth}>
                        <TournamentMenu onBackHome={this.props.backHome} onToggleEditMode={this.toggleEditMode}
                                        onDeleteTournament={this.deleteTournament}
                                        onSelectedUserChanged={this.selectedUserChanged} participants={participants}/>
                    </Responsive>
                </div>

                <div className={classes.tournamentBody}>
                    {this.state.editMode ?
                        <AddUserForm usernameToAddName={this.state.usernameToAddName}
                                     usernameToAddScore={this.state.usernameToAddScore}
                                     onNewUsernameChanged={this.newUsernameChanged}
                                     onNewUserScoreChanged={this.newUserScoreChanged} onAddUser={this.addUser}/>
                        : null}
                    <div className={classes.tableWrapper}>
                        <TournamentTable usersList={usersList} handleSort={this.handleSort} sortDirection={direction}
                                         columnToSort={this.state.column}/>
                    </div>
                    <div className={classes.matchesWrapper}>
                        {this.state.currFixtures.map((match: any) =>
                            <Match id={match.fixture_id} homeTeamName={match.homeTeam.team_name}
                                   awayTeamName={match.awayTeam.team_name} key={match.fixture_id}
                                   selectedUser={this.state.selectedUser}
                                   leagueId={this.props.tournamentLeagueId} round={this.state.leagueCurrentRound}
                                   oddsSource={this.props.oddsSource} tournamentId={this.props.tournamentId}
                                   isExist={this.state.allMatchesExists}
                                   homeGoals={match.goalsHomeTeam} awayGoals={match.goalsAwayTeam}
                                   isOver={match.statusShort === "FT"}/>)}
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state: any) => {
    return {
        currMatches: state.tournament.currMatches
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        onDeleteTournament: (id: string) => dispatch(actions.deleteTournament(id)),
        getMatches: (tournamentLeagueId: number, leagueCurrentRound: string) => dispatch(actions.getMatches(tournamentLeagueId, leagueCurrentRound)),
        setMatches: (matches: any) => dispatch(actions.setMatches(matches))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Tournament);


