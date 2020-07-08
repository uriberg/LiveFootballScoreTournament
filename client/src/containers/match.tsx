import React, {Component} from 'react';
import {Button, Icon} from "semantic-ui-react";
import classes from './match.module.css';
import {connect} from 'react-redux';
import * as actions from '../store/actions/index';
import {DEBUG} from '../constants/settings';

interface MatchProps {
    id: number,
    homeTeamName: string,
    awayTeamName: string,
    homeGoals: string,
    awayGoals: string,
    selectedUser: string
    leagueId: number,
    round: string,
    oddsSource: string,
    tournamentId: any,
    isOver: boolean,
    admin: boolean,
    isExist: boolean
}

interface PropsFromDispatch {
    getMatchDetails: (tournamentId: any, matchId: any, oddsSource: string, homeTeamName: string, awayTeamName: string) => void,
    getMatchScore: (matchId: any, homeTeamName: string, awayTeamName: string) => void,
    setFinalScore: (matchId: any, homeGoals: any, awayGoals: any, homeTeamName: string, awayTeamName: string) => void,
    onToggleEditMode: (matchId: any, tournamentId: any, oddsSource: string) => void,
    setHomeOdd: (homeOdd: any, matchId: any) => void,
    setTieOdd: (tieOdd: any, matchId: any) => void,
    setAwayOdd: (awayOdd: any, matchId: any) => void,
    onPushUserToHomeWin: (selectedUser: string, tournamentId: any, matchId: any) => void,
    onPushUserToTieWin: (selectedUser: string, tournamentId: any, matchId: any) => void,
    onPushUserToAwayWin: (selectedUser: string, tournamentId: any, matchId: any) => void,
    onInsertMatch: (matchId: any) => void
}

interface PropsFromState {
    selectionChanged: boolean,
    editMode: boolean,
    homeOdd: any,
    tieOdd: any,
    awayOdd: any,
    homeWinUsers: [],
    tieUsers: [],
    awayWinUsers: [],
    userChoseHome: boolean,
    userChoseTie: boolean,
    userChoseAway: boolean,
    isTie: boolean,
    isHomeWin: boolean,
    isAwayWin: boolean,
    goalsHomeTeam: number,
    goalsAwayTeam: number,
    ns: boolean,
    ft: boolean
}

type AllProps = PropsFromDispatch & MatchProps & PropsFromState;

class Match extends Component<AllProps> {
    private interval: number | undefined;

    state = {
        manualHomeOdd: '',
        manualTieOdd: '',
        manualAwayOdd: '',
    };

    componentDidMount() {
        //set match in store
        this.props.onInsertMatch(this.props.id);
        DEBUG && console.log(this.props.isExist);
        if (this.props.isExist) {
           // DEBUG && console.log('onLoad is exists');
            this.matchDetailsLive();
        }
        if (this.props.isOver) {
            //DEBUG && console.log(this.props.homeGoals);
           // DEBUG && console.log('MATCH IS OVER');
            this.setFinalScore();
        }
    }

    setFinalScore = async () => {
        await this.props.getMatchScore(this.props.id, this.props.homeTeamName, this.props.awayTeamName);
        this.props.setFinalScore(this.props.id, this.props.homeGoals, this.props.awayGoals, this.props.homeTeamName, this.props.awayTeamName);
    };

    componentWillUnmount(): void {
        //DEBUG && console.log('clearing match');
        clearInterval(this.interval);
    }

    componentDidUpdate(prevProps: Readonly<AllProps>): void {

        if (!prevProps.isExist && this.props.isExist) {
            this.matchDetailsLive();
        }
        if (!prevProps.isOver && this.props.isOver) {
            this.props.setFinalScore(this.props.id, this.props.goalsHomeTeam, this.props.goalsAwayTeam, this.props.homeTeamName, this.props.awayTeamName);
        }
    }

    matchDetailsLive = () => {
        this.props.getMatchDetails(this.props.tournamentId, this.props.id, this.props.oddsSource, this.props.homeTeamName, this.props.awayTeamName);
        // @ts-ignore
        this.interval = setInterval(() => {
            //DEBUG && console.log('match between ' + this.props.homeTeamName + ' and ' + this.props.awayTeamName);
            this.props.getMatchScore(this.props.id, this.props.homeTeamName, this.props.awayTeamName);
        }, 30000);//evert 5 minutes
    };

    handleHomeOddChange = ({currentTarget: {value}}: React.SyntheticEvent<HTMLInputElement>) => {
        this.setState({manualHomeOdd: value});
        this.props.setHomeOdd(value, this.props.id);
    };

    //same as above
    handleTieOddChange = ({currentTarget: {value}}: React.SyntheticEvent<HTMLInputElement>) => {
        this.setState({manualTieOdd: value});
        this.props.setTieOdd(value, this.props.id);
    };

    //same as above
    handleAwayOddChange = ({currentTarget: {value}}: React.SyntheticEvent<HTMLInputElement>) => {
        this.setState({manualAwayOdd: value});
        this.props.setAwayOdd(value, this.props.id);
    };

    pushUserToHomeWin = () => {
        //util(selectedUser, tournamentId)
        if (this.props.ns) {
            this.props.onPushUserToHomeWin(this.props.selectedUser, this.props.tournamentId, this.props.id);
        }
        else {
            alert('This match has already started');
        }
    };

    pushUserToAwayWin = () => {
        if (this.props.ns) {
            this.props.onPushUserToAwayWin(this.props.selectedUser, this.props.tournamentId, this.props.id);
        }
        else {
            alert('This match has already started');
        }
    };

    pushUserToTie = () => {
       if (this.props.ns) {
           this.props.onPushUserToTieWin(this.props.selectedUser, this.props.tournamentId, this.props.id);
       }
       else {
           alert('This match has already started');
       }
    };

    toggleEditMode = () => {
        this.props.onToggleEditMode(this.props.id, this.props.tournamentId, this.props.oddsSource);
    };


    render() {
        return (
            <div className={classes.matchContainer}>
                <Button onClick={this.pushUserToHomeWin} basic color={
                    (this.props.userChoseHome && this.props.isHomeWin) ? 'green' : (this.props.userChoseHome && !this.props.ns) ? 'red' : 'black'}
                        primary={this.props.ns && this.props.userChoseHome}>
                    <div className={classes.resultOption}>
                        <div>{this.props.homeTeamName}{!this.props.ns ? '(' + this.props.goalsHomeTeam + ')' : null}</div>
                        {this.props.editMode ?
                            <input value={this.state.manualHomeOdd} onChange={this.handleHomeOddChange}/>
                            :
                            <div>
                                {this.props.homeOdd}
                            </div>
                        }
                    </div>
                </Button>
                <Button onClick={this.pushUserToTie} basic color={
                    (this.props.userChoseTie && this.props.isTie) ? 'green' : (this.props.userChoseTie && !this.props.ns) ? 'red' : 'black'}
                        primary={this.props.ns && this.props.userChoseTie}>
                    <div className={classes.resultOption} style={{minWidth: '150px'}}>
                        <div>X</div>
                        {this.props.editMode ?
                            <input value={this.props.tieOdd} onChange={this.handleTieOddChange}/>
                            :
                            <div>
                                {this.props.tieOdd}
                            </div>
                        }
                    </div>
                </Button>
                <Button onClick={this.pushUserToAwayWin} basic color={
                    (this.props.userChoseAway && this.props.isAwayWin) ? 'green' : (this.props.userChoseAway && !this.props.ns) ? 'red' : 'black'}
                        primary={this.props.ns && this.props.userChoseAway}>
                    <div className={classes.resultOption}>
                        <div>{this.props.awayTeamName}{!this.props.ns ? '(' + this.props.goalsAwayTeam + ')' : null}</div>
                        {this.props.editMode ?
                            <input value={this.props.awayOdd} onChange={this.handleAwayOddChange}/>
                            :
                            <div>
                                {this.props.awayOdd}
                            </div>
                        }
                    </div>
                </Button>
                {this.props.admin && this.props.oddsSource === 'Manual' ?
                <Button onClick={this.toggleEditMode} icon>
                    <Icon name={this.props.editMode ? 'check' : 'edit'}/>
                </Button> : null}
            </div>
        );
    }
}

const mapStateToProps = (state: any, AllProps: AllProps) => {
            //DEBUG && console.log(state.match.matchesById[AllProps.id]);
            if (state.match.matchesById[AllProps.id]) {
                return {
                    selectionChanged: state.match.matchesById[AllProps.id].selectionChanged,
                    editMode: state.match.matchesById[AllProps.id].editMode,
                    homeOdd: state.match.matchesById[AllProps.id].homeOdd,
                    tieOdd: state.match.matchesById[AllProps.id].tieOdd,
                    awayOdd: state.match.matchesById[AllProps.id].awayOdd,
                    homeWinUsers: state.match.matchesById[AllProps.id].homeWinUsers,
                    tieUsers: state.match.matchesById[AllProps.id].tieUsers,
                    awayWinUsers: state.match.matchesById[AllProps.id].awayWinUsers,
                    userChoseHome: AllProps.selectedUser && state.match.matchesById[AllProps.id].homeWinUsers.findIndex((item: any) => item.tournamentId === AllProps.tournamentId && item.nickname === AllProps.selectedUser) > -1,
                    userChoseTie: AllProps.selectedUser && state.match.matchesById[AllProps.id].tieUsers.findIndex((item: any) => item.tournamentId === AllProps.tournamentId && item.nickname === AllProps.selectedUser) > -1,
                    userChoseAway: AllProps.selectedUser && state.match.matchesById[AllProps.id].awayWinUsers.findIndex((item: any) => item.tournamentId === AllProps.tournamentId && item.nickname === AllProps.selectedUser) > -1,
                    isTie: state.match.matchesById[AllProps.id].isTie,
                    isHomeWin: state.match.matchesById[AllProps.id].isHomeWin,
                    isAwayWin: state.match.matchesById[AllProps.id].isAwayWin,
                    goalsHomeTeam: state.match.matchesById[AllProps.id].goalsHomeTeam,
                    goalsAwayTeam: state.match.matchesById[AllProps.id].goalsAwayTeam,
                    ns: state.match.matchesById[AllProps.id].ns,
                    ft: state.match.matchesById[AllProps.id].ft
                }
            }
            else {
                return {}
            }
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        getMatchDetails: (tournamentId: any, matchId: any, oddsSource: string, homeTeamName: string, awayTeamName: string) => dispatch(actions.getMatchDetails(tournamentId, matchId, oddsSource, homeTeamName, awayTeamName)),
        getMatchScore: (matchId: any, homeTeamName: string, awayTeamName: string) => dispatch(actions.getMatchScore(matchId, homeTeamName, awayTeamName)),
        setFinalScore: (matchId: any, homeGoals: any, awayGoals: any, homeTeamName: string, awayTeamName: string) => dispatch(actions.setFinalScore(matchId, homeGoals, awayGoals, homeTeamName, awayTeamName)),
        onToggleEditMode: (matchId: any, tournamentId: any, oddsSource: string) => dispatch(actions.toggleEditMode(matchId, tournamentId, oddsSource)),
        setHomeOdd: (homeOdd: any, matchId: any) => dispatch(actions.setHomeOdd(homeOdd, matchId)),
        setTieOdd: (tieOdd: any, matchId: any) => dispatch(actions.setTieOdd(tieOdd, matchId)),
        setAwayOdd: (awayOdd: any, matchId: any) => dispatch(actions.setAwayOdd(awayOdd, matchId)),
        onPushUserToHomeWin: (selectedUser: string, tournamentId: any, matchId: any) => dispatch(actions.pushUserToHomeWin(selectedUser, tournamentId, matchId)),
        onPushUserToTieWin: (selectedUser: string, tournamentId: any, matchId: any) => dispatch(actions.pushUserToTie(selectedUser, tournamentId, matchId)),
        onPushUserToAwayWin: (selectedUser: string, tournamentId: any, matchId: any) => dispatch(actions.pushUserToAwayWin(selectedUser, tournamentId, matchId)),
        onInsertMatch: (matchId: any) => dispatch(actions.insertMatch(matchId))
    }
};


// @ts-ignore
export default connect(mapStateToProps, mapDispatchToProps)(Match);
