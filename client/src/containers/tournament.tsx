import React, {Component} from 'react';
import axios from 'axios';
import axiosInstance from '../axios';
import User from "../components/user";
import Match from "../components/match";
import {Button, Form, Menu, Dropdown, Select, Table} from "semantic-ui-react";
import classes from './tournament.module.css';
import _ from 'lodash';


interface User {
    name: string;
    totalScore: number;
    weeklyScore: number;
}

interface MatchType {
    homeOdd: number;
    awayOdd: number;
    tieOdd: number;
    homeWinUsers: [];
    awayWinUsers: [];
    tieUsers: [];
    goalsHomeTeam: number;
    goalsAwayTeam: number;
    homeTeamName: string;
    awayTeamName: string;
}

interface TournamentProps {
    tournamentName: string,
    tournamentLeagueId: number,
    users: User [],
    tournamentId: string,
    lastRecordedRound: string,
    backHome: () => void
}

class Tournament extends Component<TournamentProps> {
    private weeklyScoreinterval: number | undefined;
    private currMatchesInterval: number | undefined;
    private usersInterval: number | undefined;
    private checkRoundInterval: number | undefined;


    state = {
        users: [],
        currResult: 0,
        currFixtures: [],
        selectedUser: '',
        usernameToAddName: '',
        usernameToAddScore: 0,
        currMatches: [],
        leagueId: null,
        propUsers: this.props.users,
        leagueCurrentRound: '',
        desiredPrevRound: '',
        showPrevMatches: false,
        unhandledMatches: [],
        activeItem: null,
        editMode: false,
        direction: 'descending',
        column: undefined
    };

    componentDidMount() {
        this.getCurrentRound(this.props.tournamentLeagueId);
        let tempUsers = [...this.state.propUsers];
        this.setState({users: tempUsers});
        //this.getMatches();
        this.calculateWeeklyScore();

        // @ts-ignore
        // this.usersInterval = setInterval(() => {
        //     this.getUsers();
        // }, 5000);
        //this.getCurrentRound();
        // @ts-ignore
        this.currMatchesInterval = setInterval(() => {
            this.getMatches();
        }, 5000);
        // @ts-ignore
        this.weeklyScoreinterval = setInterval(() => {
            this.calculateWeeklyScore();
        }, 10000);

        // @ts-ignore
        // this.checkRoundInterval = setInterval( () => {
        //     this.getCurrentRound(this.props.tournamentLeagueId);
        // }, 86400000);//i.e every one day

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

    addMatch = (matchId: any, homeTeamName: any, awayTeamName: any, currentRound: any, leagueId: any) => {
        axiosInstance().post('/matches/add', {
            matchId: matchId,
            homeTeamName: homeTeamName,
            awayTeamName: awayTeamName,
            round: currentRound,
            leagueId: leagueId
        })
            .then(response => {
                console.log(response);
            })
            .catch(err => {
                console.log('Error: ' + err)
            });
    };

    getCurrentRound = (leagueId: number) => {
        const headers = {
            "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
            "x-rapidapi-key": "caf2d8bb45msh890d53234504df6p11bfa9jsn11476be6f67b"
        };

        axios.get('https://api-football-v1.p.rapidapi.com/v2/fixtures/rounds/' + leagueId + '/current', {headers})
            .then(response => {
                // console.log(response.data.api.fixtures[0]);
                let currentRound = response.data.api.fixtures[0];
                console.log(currentRound);
                this.setState({leagueCurrentRound: currentRound, desiredPrevRound: currentRound});
                this.getCurrRoundMatches(this.state.leagueCurrentRound);
            })
            .catch(err => console.log(err));
    };
    
    deleteTournament = () => {
        if (window.confirm("Do you want to delete " + this.props.tournamentName + '?') == true) {
            axiosInstance().delete('/tournaments/' + this.props.tournamentId)
                .then(() => {
                    this.props.backHome();

                })
                .catch(err => {
                    console.log('Error: ' + err)
                });
        }
    };

    desiredPrevRound = () => {
        let currentPrevRound = this.state.desiredPrevRound;
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
        const newDesiredPrevRound = this.state.desiredPrevRound.substring(0, firstNumberIndex) + newPrevRoundNumber;
        console.log(newDesiredPrevRound);
        this.setState({desiredPrevRound: newDesiredPrevRound});
        return newDesiredPrevRound;
    };

    getUsers = () => {
        axiosInstance().get('/users')
            .then(response => {
                // console.log(response);
                this.setState({users: response.data});
            })
            .catch(err => {
                console.log(err)
            });
    };

    getMatches = () => {
        if (this.props.tournamentLeagueId && this.state.leagueCurrentRound) {
            console.log('should fetch matches');
            axiosInstance().get('/matches/' + this.props.tournamentLeagueId + '/' + this.state.leagueCurrentRound)
                .then(response => {
                    console.log(response);
                    this.setState({currMatches: response.data});
                })
                .catch(err => {
                    console.log(err)
                });
        }
        console.log(this.state.currMatches);

    };

    checkDatabase = () => {
        axiosInstance().get('/matches/' + this.props.tournamentLeagueId + '/' + this.state.leagueCurrentRound)
            .then(response => {
                console.log(response);
                console.log(this.state.leagueCurrentRound);
                if (response.data.length === 0) {
                    console.log('LENGTH IS ZERO');
                    this.updateTournamentRound();
                }
                this.setState({currMatches: response.data});
            })
            .catch(err => {
                console.log(err)
            });
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

    loopUnhandledMatches = () => {
        console.log(this.state.unhandledMatches);
        const headers = {
            "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
            "x-rapidapi-key": "caf2d8bb45msh890d53234504df6p11bfa9jsn11476be6f67b"
        };
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


    setCurrentDatabase = () => {

        // @ts-ignore
        for (let i = 0; i < this.state.currFixtures.length; i++) {
            // @ts-ignore
            //  console.log(this.state.currFixtures[i].fixture_id);
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
            this.addMatch(matchId, homeTeamName, awayTeamName, currentRound, leagueId);
            //this.addMatch(this.state.currFixtures[i].fixture_id);
        }
    };

    getCurrRoundMatches = (currentRound: string) => {
        const headers = {
            "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
            "x-rapidapi-key": "caf2d8bb45msh890d53234504df6p11bfa9jsn11476be6f67b"
        };
        //  console.log(this.state.leagueCurrentRound);
        console.log('currRoundMatches');
        console.log(this.state.leagueCurrentRound);
        axios.get('https://api-football-v1.p.rapidapi.com/v2/fixtures/league/' + this.props.tournamentLeagueId + '/' + this.state.leagueCurrentRound, {headers})
            .then(response => {
                this.setState({
                    currFixtures: response.data.api.fixtures,
                    leagueCurrentRound: response.data.api.fixtures[0].round,
                    desiredPrevRound: response.data.api.fixtures[0].round
                });
                this.checkDatabase();
            })
            .catch(err => console.log(err));
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
        let users : User [] = [...this.state.users];
        const newUser = {
            name: this.state.usernameToAddName,
            totalScore: this.state.usernameToAddScore,
            weeklyScore: 0
        };
        users.push(newUser);
        axiosInstance().put('/tournaments/' + this.props.tournamentId + '/addUser', {users: users})
            .then(response => {
                console.log(response);
                this.setState({users: response.data.tournamentUsers});
            })
            .catch(err => {
                console.log(err)
            });
    };

    calculateWeeklyScore = () => {
        let users: User [] = [...this.state.users];
        let matches: MatchType [] = [...this.state.currMatches];
        console.log(matches);
        for (let i = 0; i < users.length; i++) {
            users[i].weeklyScore = 0;
            for (let j = 0; j < matches.length; j++) {
                if (matches[j].goalsHomeTeam !== null) {
                    if (matches[j].goalsHomeTeam > matches[j].goalsAwayTeam) {
                        // @ts-ignore
                        if (matches[j].homeWinUsers.indexOf(users[i].name) > -1) {
                            users[i].weeklyScore = +parseFloat((users[i].weeklyScore + matches[j].homeOdd).toFixed(2));
                        }
                    } else if (matches[j].goalsHomeTeam < matches[j].goalsAwayTeam) {
                        // @ts-ignore
                        if (matches[j].awayWinUsers.indexOf(users[i].name) > -1) {
                            users[i].weeklyScore = +parseFloat((users[i].weeklyScore + matches[j].awayOdd).toFixed(2));
                        }
                    } else if (matches[j].goalsHomeTeam === matches[j].goalsAwayTeam) {
                        // @ts-ignore
                        if (matches[j].tieUsers.indexOf(users[i].name) > -1) {
                            users[i].weeklyScore = +parseFloat((users[i].weeklyScore + matches[j].tieOdd).toFixed(2));
                        }
                    }
                }
            }
        }
        if (users.length > 0) {
            this.updateUsersScore(users);
        }
    };

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
        const participants = this.state.users.map((user: User) => ({key: user.name, value: user.name, text: user.name}));
        const usersList = [...this.state.users];
        const direction = this.state.direction;
        return (
            <div>
                <Menu inverted floated={"right"}>
                    <Menu.Item
                        name='home'
                        onClick={this.props.backHome}
                    />
                    <Menu.Item
                        name='addUser'
                        onClick={this.toggleEditMode}
                    />
                    <Menu.Item
                        name='deleteTournament'
                        onClick={this.deleteTournament}
                    />
                    <Menu.Item>
                        <Select options={participants} onChange={this.selectedUserChanged} placeholder="Participants" style={{backgroundColor: '#1B1C1D', color: 'rgba(255,255,255,.9)'}}/>
                    </Menu.Item>
                </Menu>
                <div className={classes.tournamentBody}>
                    {this.state.editMode ?
                        <Form className={classes.padding5}>
                            <Form.Field>
                                <label>Username</label>
                                <input placeholder='Full name' value={this.state.usernameToAddName}
                                       onChange={this.newUsernameChanged}/>
                            </Form.Field>
                            <Form.Field>
                                <label>Initial score</label>
                                <input placeholder='score' value={this.state.usernameToAddScore}
                                       onChange={this.newUserScoreChanged}/>
                            </Form.Field>
                            <Button type='submit' onClick={this.addUser}>Submit</Button>
                        </Form>
                        : null}
                    <div className={classes.padding5}>
                        <Table sortable celled fixed>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell
                                        sorted={this.state.column === 'name' ? (direction === 'descending' ? 'descending' : 'ascending') : undefined}
                                        onClick={this.handleSort('name')}
                                    >
                                        Name
                                    </Table.HeaderCell>
                                    <Table.HeaderCell
                                        sorted={this.state.column === 'totalScore' ? (direction === 'descending' ? 'descending' : 'ascending') : undefined}
                                        onClick={this.handleSort('totalScore')}
                                    >
                                        Score
                                    </Table.HeaderCell>
                                    <Table.HeaderCell
                                        sorted={this.state.column === 'weeklyScore' ? (direction === 'descending' ? 'descending' : 'ascending') : undefined}
                                        onClick={this.handleSort('weeklyScore')}
                                    >
                                        Weekly Score
                                    </Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {_.map(usersList, ({ totalScore, name, weeklyScore }) => (
                                    <Table.Row key={name}>
                                        <Table.Cell>{name}</Table.Cell>
                                        <Table.Cell>{+(parseFloat(totalScore).toFixed(2))}</Table.Cell>
                                        <Table.Cell>{weeklyScore}</Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table>
                    </div>
                    <div>
                        {this.state.currFixtures.map((match: any) =>
                            <Match id={match.fixture_id} homeTeamName={match.homeTeam.team_name}
                                   awayTeamName={match.awayTeam.team_name} key={match.fixture_id}
                                   selectedUser={this.state.selectedUser}
                                   leagueId={this.props.tournamentLeagueId} round={this.state.leagueCurrentRound}/>)}
                    </div>
                </div>
            </div>
        );
    }
}

export default Tournament;
