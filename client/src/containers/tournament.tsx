import React, {Component} from 'react';
import Match from "./match";
import {Responsive} from "semantic-ui-react";
import classes from './tournament.module.css';
import _ from 'lodash';
import {connect} from 'react-redux';
import * as actions from '../store/actions/index';
import {User, MatchType} from '../constants/interfaces';
import TournamentTable from "../components/tournamentTable";
import TournamentMenu from "../components/tournamentMenu";
import AddUserForm from "../components/addUserForm";
import {setIntervalAndExecute} from "../utils/setIntervalAndExecute";

interface PropsFromDispatch {
    onDeleteTournament: (id: string) => void,
    getMatches: (tournamentLeagueId: number, leagueCurrentRound: string) => void,
    setMatches: (matches: any) => void,
    checkDatabase: (currentRound: string, leagueId: number, tournamentId: string) => void,
    getCurrentRound: (tournamentId: string, leagueId: number, users: any) => void,
    setTournamentUsers: (users: User []) => void,
    addUser: (tournamentId: string, users: User []) => void,
    calculateWeeklyScore: (tournamentId: string) => void
}

interface PropsFromState {
    currFixtures: [],
    currMatches: [],
    allMatchesExists: boolean,
    leagueCurrentRound: string,
    users: User []
}

interface TournamentProps {
    tournamentName: string,
    tournamentLeagueId: number,
    tournamentId: string,
    lastRecordedRound: string,
    oddsSource: string,
    backHome: () => void,
    initialUsers: User [],
}

type AllProps = PropsFromDispatch & TournamentProps & PropsFromState;

class Tournament extends Component<AllProps> {
    private weeklyScoreInterval: number | undefined;
    private currMatchesInterval: number | undefined;
    private checkRoundInterval: number | undefined;
    //private roundI: any;

    state = {
        usernameToAddName: '',
        usernameToAddScore: 0,
        editMode: false,
        direction: 'descending',
        column: undefined,
        selectedUser: '',
        leagueCurrentRound: '',
        usersList: []
    };

    componentDidMount() {
        this.props.setTournamentUsers(this.props.initialUsers);
        this.setState({usersList: this.props.initialUsers});
        this.props.getCurrentRound(this.props.tournamentId, this.props.tournamentLeagueId, this.props.initialUsers);
        this.props.calculateWeeklyScore(this.props.tournamentId);

        this.currMatchesInterval = window.setInterval(() => {
            this.props.getMatches(this.props.tournamentLeagueId, this.props.leagueCurrentRound);
        }, 5000);

        this.weeklyScoreInterval = window.setInterval(() => {
            this.props.calculateWeeklyScore(this.props.tournamentId);
        }, 10000);

        this.checkRoundInterval = window.setInterval(() => {
            this.props.getCurrentRound(this.props.tournamentId, this.props.tournamentLeagueId, this.props.users);
        }, 120000);//i.e every two minutes

        //this.roundI = setIntervalAndExecute(this.props.getCurrentRound(this.props.tournamentId, this.props.tournamentLeagueId, this.props.users), 5000);
    }

    componentWillUnmount(): void {
        clearInterval(this.weeklyScoreInterval);
        clearInterval(this.currMatchesInterval);
        clearInterval(this.checkRoundInterval);
       //clearInterval(this.roundI);
    }

    deleteTournament = async () => {
        if (window.confirm("Do you want to delete " + this.props.tournamentName + '?') === true) {
            await this.props.onDeleteTournament(this.props.tournamentId);
            this.props.backHome();
        }
    };

    selectedUserChanged = (event: any, {value}: any) => {
        this.setState({selectedUser: value});
    };

    newUserScoreChanged = ({currentTarget: {value}}: React.SyntheticEvent<HTMLInputElement>) => {
        this.setState({usernameToAddScore: value});
    };

    newUsernameChanged = ({currentTarget: {value}}: React.SyntheticEvent<HTMLInputElement>) => {
        this.setState({usernameToAddName: value});
    };

    addUser = () => {
        let users: User [] = [...this.props.users];
        const newUser = {
            name: this.state.usernameToAddName,
            totalScore: this.state.usernameToAddScore,
            weeklyScore: 0
        };

        users.push(newUser);
        this.props.addUser(this.props.tournamentId, users);
        this.setState({usernameToAddName: '', usernameToAddScore: 0, usersList: users});
    };

    handleSort = (clickedColumn: any) => () => {
        let users = [...this.state.usersList];

        if (this.state.column !== clickedColumn) {
            this.setState({
                column: clickedColumn,
                usersList: _.sortBy(users, [clickedColumn]),
                direction: 'ascending',
            });
            return
        }

        this.setState({
            usersList: users.reverse(),
            direction: this.state.direction === 'ascending' ? 'descending' : 'ascending',
        })
    };

    toggleEditMode = () => {
        this.setState((prevState: any) => ({
            editMode: !prevState.editMode
        }));
    };


    render() {
        const participants = this.props.users.map((user: User) => ({
            key: user.name,
            value: user.name,
            text: user.name
        }));
        const usersList: User [] = [...this.state.usersList];
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
                        {this.props.currFixtures.map((match: any) =>
                            <Match id={match.fixture_id} homeTeamName={match.homeTeam.team_name}
                                   awayTeamName={match.awayTeam.team_name} key={match.fixture_id}
                                   selectedUser={this.state.selectedUser}
                                   leagueId={this.props.tournamentLeagueId} round={this.state.leagueCurrentRound}
                                   oddsSource={this.props.oddsSource} tournamentId={this.props.tournamentId}
                                   isExist={this.props.allMatchesExists}
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
        currFixtures: state.tournament.currFixtures,
        currMatches: state.tournament.currMatches,
        allMatchesExists: state.tournament.allMatchesExists,
        users: state.tournament.users,
        leagueCurrentRound: state.tournament.leagueCurrentRound,
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        onDeleteTournament: (id: string) => dispatch(actions.deleteTournament(id)),
        getMatches: (tournamentLeagueId: number, leagueCurrentRound: string) => dispatch(actions.getMatches(tournamentLeagueId, leagueCurrentRound)),
        setMatches: (matches: any) => dispatch(actions.setMatches(matches)),
        checkDatabase: (currentRound: string, leagueId: number, tournamentId: string) => dispatch(actions.checkDatabase(currentRound, leagueId, tournamentId)),
        getCurrentRound: (tournamentId: string, leagueId: number, users: any) => dispatch(actions.getCurrentRound(tournamentId, leagueId, users)),
        setTournamentUsers: (users: User []) => dispatch(actions.setUsers(users)),
        addUser: (tournamentId: string, users: User []) => dispatch(actions.addUser(tournamentId, users)),
        calculateWeeklyScore: (tournamentId: string) => dispatch(actions.onCalculateWeeklyScore(tournamentId))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Tournament);


