import React, {Component} from 'react';
import Match from "./match";
import {Responsive} from "semantic-ui-react";
import classes from './tournament.module.css';
import {connect} from 'react-redux';
import * as actions from '../store/actions/index';
import {User} from '../constants/interfaces';
import TournamentTable from "../components/tournamentTable";
import TournamentMenu from "../components/tournamentMenu";
import Popup from "../components/popup";
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';


interface PropsFromDispatch {
    onDeleteTournament: (id: string) => void,
    getMatches: (tournamentLeagueId: number, leagueCurrentRound: string) => void,
    setMatches: (matches: any) => void,
    checkDatabase: (currentRound: string, leagueId: number, tournamentId: string) => void,
    getCurrentRound: (tournamentId: string, leagueId: number, users: any) => void,
    setTournamentUsers: (users: User []) => void,
    addUser: (tournamentId: string, users: User []) => void,
    calculateWeeklyScore: (tournamentId: string) => void,
    onSortByUsers: (clickedColumn: any) => void,
    onReverseUsers: () => void
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
    admin: boolean,
    currUserNickname: string
}

type AllProps = PropsFromDispatch & TournamentProps & PropsFromState;

class Tournament extends Component<AllProps> {
    private weeklyScoreInterval: number | undefined;
    private currMatchesInterval: number | undefined;
    private checkRoundInterval: number | undefined;

    state = {
        usernameToAddName: '',
        usernameToAddScore: 0,
        editMode: false,
        direction: 'descending',
        column: undefined,
        selectedUser: '',
        leagueCurrentRound: '',
        usersList: [],
        userAdded: false,
        showPopup: false
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

    }

    componentDidUpdate(prevProps: Readonly<AllProps>, prevState: Readonly<{}>, snapshot?: any): void {
        if (this.state.userAdded){
            this.setState({usersList: this.props.users, userAdded: false});
        }
    }

    componentWillUnmount(): void {

        clearInterval(this.weeklyScoreInterval);
        clearInterval(this.currMatchesInterval);
        clearInterval(this.checkRoundInterval);
    }

    deleteTournament = async () => {
        if (window.confirm("Do you want to delete " + this.props.tournamentName + '?') === true) {
            await this.props.onDeleteTournament(this.props.tournamentId);
            this.props.backHome();
        }
    };

    handleSort = (clickedColumn: any) => () => {

        if (this.state.column !== clickedColumn) {

            this.setState({
                column: clickedColumn,
                // usersList: _.sortBy(users, [clickedColumn]),
                direction: 'ascending',
            });
            this.props.onSortByUsers(clickedColumn);
            return
        }

        this.props.onReverseUsers();
        this.setState({
            // usersList: users.reverse(),
            direction: this.state.direction === 'ascending' ? 'descending' : 'ascending',
        });

    };

    toggleEditMode = () => {
        this.setState((prevState: any) => ({
            editMode: !prevState.editMode
        }));
    };

    togglePopup = () => {
        this.setState((prevState: any) => ({
            showPopup: !prevState.showPopup
        }));
    };

    render() {

        const direction = this.state.direction;
        const showPopup = this.state.showPopup;

        return (
            <div className={classes.tournamentWrapper}>

                <ReactCSSTransitionGroup
                    transitionName={{
                        enter: classes.enter,
                        enterActive: classes.enterActive,
                        leave: classes.leave,
                        leaveActive: classes.leaveActive,
                    }}
                    transitionEnterTimeout={1250}
                    transitionLeaveTimeout={1250}>
                    {this.state.showPopup ? <Popup closePopup={this.togglePopup} open={!showPopup}/> : undefined}
                </ReactCSSTransitionGroup>


                <div style={{display: 'flex', justifyContent: 'center'}}>
                    <Responsive {...Responsive.onlyMobile}>
                        <TournamentMenu onBackHome={this.props.backHome} onToggleEditMode={this.toggleEditMode}
                                        onDeleteTournament={this.deleteTournament}
                                        selectedUser={this.props.currUserNickname}
                                        isAdmin={this.props.admin}
                                        togglePopup={this.togglePopup}/>
                    </Responsive>
                </div>

                <div className={classes.desktopMenu}>
                    <Responsive minWidth={Responsive.onlyTablet.minWidth}>
                        <TournamentMenu onBackHome={this.props.backHome} onToggleEditMode={this.toggleEditMode}
                                        onDeleteTournament={this.deleteTournament}
                                        selectedUser={this.props.currUserNickname}
                                        isAdmin={this.props.admin}
                                        togglePopup={this.togglePopup}/>
                    </Responsive>
                </div>

                <div className={classes.tournamentBody}>
                    <div className={classes.tableWrapper}>
                        <TournamentTable usersList={this.props.users} handleSort={this.handleSort} sortDirection={direction}
                                         columnToSort={this.state.column}/>
                    </div>
                    <div className={classes.matchesWrapper}>
                        {this.props.currFixtures.map((match: any) =>
                            <Match id={match.fixture_id} homeTeamName={match.homeTeam.team_name}
                                   awayTeamName={match.awayTeam.team_name} key={match.fixture_id}
                                   selectedUser={this.props.currUserNickname}
                                   leagueId={this.props.tournamentLeagueId} round={this.props.leagueCurrentRound}
                                   oddsSource={this.props.oddsSource} tournamentId={this.props.tournamentId}
                                   isExist={this.props.allMatchesExists}
                                   homeGoals={match.goalsHomeTeam} awayGoals={match.goalsAwayTeam}
                                   isOver={match.statusShort === "FT"}
                                    admin={this.props.admin}/>)}
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
        calculateWeeklyScore: (tournamentId: string) => dispatch(actions.onCalculateWeeklyScore(tournamentId)),
        onSortByUsers: (clickedColumn: any) => dispatch(actions.sortUsers(clickedColumn)),
        onReverseUsers: () => dispatch(actions.reverseUsers())
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Tournament);


