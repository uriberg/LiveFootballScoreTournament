import React, {Component} from 'react';
import {Button, Icon} from "semantic-ui-react";
import classes from './match.module.css';
import {connect} from 'react-redux';
import * as actions from '../store/actions/index';

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
    isExist: boolean,
    isOver: boolean
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
        if (this.props.isExist) {
            console.log('onLoad is exists');
            this.props.getMatchDetails(this.props.tournamentId, this.props.id, this.props.oddsSource, this.props.homeTeamName, this.props.awayTeamName);
            // @ts-ignore
            this.interval = setInterval(() => {
                this.props.getMatchScore(this.props.id, this.props.homeTeamName, this.props.awayTeamName);
            }, 30000);//evert 5 minutes
        }
        if (this.props.isOver) {
            //console.log(this.props.homeGoals);
            this.props.setFinalScore(this.props.id, this.props.homeGoals, this.props.awayGoals, this.props.homeTeamName, this.props.awayTeamName);
        }
    }

    componentWillUnmount(): void {
        console.log('clearing match');
        clearInterval(this.interval);
    }

    componentDidUpdate(prevProps: Readonly<AllProps>): void {
        if (prevProps.selectedUser !== this.props.selectedUser || this.props.selectionChanged || prevProps.leagueId !== this.props.leagueId) {

            // axiosInstance().get('/matches/' + this.props.id)
            //     .then(response => {
            //         //  console.log(response);
            //         let selectionHasChanged = true;
            //         if (prevProps.selectedUser === this.props.selectedUser) {
            //             selectionHasChanged = false;
            //         }
            //         //setState for selectionChanged, but besides of that its a pure action and we send selectedUser and tournamentId as params.
            //         this.setState({
            //             userChoseAway: response.data.awayWinUsers.findIndex((item: any) => item.name === this.props.selectedUser && item.tournamentId === this.props.tournamentId) > -1,
            //             userChoseHome: response.data.homeWinUsers.findIndex((item: any) => item.name === this.props.selectedUser && item.tournamentId === this.props.tournamentId) > -1,
            //             userChoseTie: response.data.tieUsers.findIndex((item: any) => item.name === this.props.selectedUser && item.tournamentId === this.props.tournamentId) > -1,
            //             selectionChanged: selectionHasChanged
            //         });
            //     })
            //     .catch(err => {
            //         console.log('Error: ' + err)
            //     });
           // const userChoseHome = this.props.homeWinUsers.findIndex((item: any) => item.tournamentId === this.props.tournamentId && item.name === this.props.selectedUser) > -1;
           // const userChoseTie = this.props.tieUsers.findIndex((item: any) => item.tournamentId === this.props.tournamentId && item.name === this.props.selectedUser) > -1;
           // const userChoseAway = this.props.awayWinUsers.findIndex((item: any) => item.tournamentId === this.props.tournamentId && item.name === this.props.selectedUser) > -1;
           // console.log(userChoseHome);
           //this.setState({userChoseHome: userChoseHome, userChoseTie: userChoseTie, userChoseAway: userChoseAway});
        }
        if (!prevProps.isExist && this.props.isExist) {
            console.log('updated!! Exists!!');
            this.props.getMatchDetails(this.props.tournamentId, this.props.id, this.props.oddsSource, this.props.homeTeamName, this.props.awayTeamName);
        }
        if (!prevProps.isOver && this.props.isOver) {
            this.props.setFinalScore(this.props.id, this.props.goalsHomeTeam, this.props.goalsAwayTeam, this.props.homeTeamName, this.props.awayTeamName);
        }
    }

    handleHomeOddChange = ({currentTarget: {value}}: React.SyntheticEvent<HTMLInputElement>) => {
        //clear timeout
        //clearTimeout(this.homeOddTimeout);
        //then, setTimeout of 5 seconds, then update store using dispatch(setHomeOdd);
        // @ts-ignore
        // this.homeOddTimeout = setTimeout(() => {
        //     //dispatch to set homeOdd: value
        //     this.props.setHomeOdd(value);
        // }, 5000);//after 5 seconds
        this.setState({manualHomeOdd: value});
        this.props.setHomeOdd(value, this.props.id);
    };

    //same as above
    handleTieOddChange = ({currentTarget: {value}}: React.SyntheticEvent<HTMLInputElement>) => {
        //clear timeout
        console.log('home odd handle');
        console.log(value);
        //clearTimeout(this.tieOddTimeout);
        //then, setTimeout of 5 seconds, then update store using dispatch(setTieOdd);
        // @ts-ignore
        // this.tieOddTimeout = setTimeout(() => {
        //     //dispatch to set tieOdd: value
        //     this.props.setTieOdd(value);
        // }, 5000);//after 5 seconds
        this.setState({manualTieOdd: value});
        this.props.setTieOdd(value, this.props.id);
    };

    //same as above
    handleAwayOddChange = ({currentTarget: {value}}: React.SyntheticEvent<HTMLInputElement>) => {
        //clear timeout
        // clearTimeout(this.homeOddTimeout);
        // //then, setTimeout of 5 seconds, then update store using dispatch(setAwayOdd);
        // // @ts-ignore
        // this.awayOddTimeout = setTimeout(() => {
        //     //dispatch to set awayOdd: value
        //     this.props.setAwayOdd(value);
        // }, 5000);//after 5 seconds
        this.setState({manualAwayOdd: value});
        this.props.setAwayOdd(value, this.props.id);
    };

    //matches redux
    //action creator
    pushUserToHomeWin = () => {
        //util(selectedUser, tournamentId)
        this.props.onPushUserToHomeWin(this.props.selectedUser, this.props.tournamentId, this.props.id);
    };

    //matches redux
    pushUserToAwayWin = () => {
        this.props.onPushUserToAwayWin(this.props.selectedUser, this.props.tournamentId, this.props.id);
    };

    //matches redux
    pushUserToTie = () => {
       this.props.onPushUserToTieWin(this.props.selectedUser, this.props.tournamentId, this.props.id);
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
                <Button onClick={this.toggleEditMode} icon>
                    <Icon name={this.props.editMode ? 'check' : 'edit'}/>
                </Button>
            </div>
        );
    }
}

const mapStateToProps = (state: any, AllProps: AllProps) => {
            //console.log(state.match.matchesById[AllProps.id]);
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
                    userChoseHome: AllProps.selectedUser && state.match.matchesById[AllProps.id].homeWinUsers.findIndex((item: any) => item.tournamentId === AllProps.tournamentId && item.name === AllProps.selectedUser) > -1,
                    userChoseTie: AllProps.selectedUser && state.match.matchesById[AllProps.id].tieUsers.findIndex((item: any) => item.tournamentId === AllProps.tournamentId && item.name === AllProps.selectedUser) > -1,
                    userChoseAway: AllProps.selectedUser && state.match.matchesById[AllProps.id].awayWinUsers.findIndex((item: any) => item.tournamentId === AllProps.tournamentId && item.name === AllProps.selectedUser) > -1,
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
