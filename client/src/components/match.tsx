import React, {Component} from 'react';
import {Button, Icon} from "semantic-ui-react";
import axios from 'axios';
import axiosInstance from '../axios';
import classes from './match.module.css';


interface MatchProps {
    id: number,
    homeTeamName: string,
    awayTeamName: string,
    homeGoals: string,
    awayGoals: string,
    currWinner?: string,
    result?: string,
    odds?: {
        HomeWin: number,
        AwayWin: number,
        Tie: number
    },
    selectedUser: string
    leagueId: number,
    round: string;
    oddsSource: string,
    tournamentId: any,
    isExist: boolean,
    isOver: boolean
}

class Match extends Component<MatchProps> {
    private interval : number | undefined;
    private oddsInterval : number | undefined;

    state = {
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
        selectionChanged: false,
        isTie: false,
        isHomeWin: false,
        isAwayWin: false,
        goalsHomeTeam: -1,
        goalsAwayTeam: -1,
        ns: true,
        ft: false
    };

    componentDidMount() {
        if (this.props.isExist) {
            console.log('onLoad is exists');
          this.initiate();
        }
        if (this.props.isOver){
            console.log('HomeGoals: ' + this.props.homeGoals);
            const isHomeWin = this.props.homeGoals > this.props.awayGoals;
            const isTie = this.props.homeGoals === this.props.awayGoals;
            const isAwayWin = this.props.homeGoals < this.props.awayGoals;
            this.updateMatchScore(+this.props.homeGoals, +this.props.awayGoals);
            this.setState({ns: false ,ft: true, goalsHomeTeam: this.props.homeGoals, goalsAwayTeam: this.props.awayGoals, isHomeWin: isHomeWin, isTie: isTie, isAwayWin: isAwayWin});
        }
        // if (this.props.odds?.HomeWin && this.props.odds?.Tie && this.props.odds?.AwayWin) {
        //     this.setState({editMode: false});
        // }
    }

    componentWillUnmount(): void {
        clearInterval(this.interval);
    }

    initiate = () => {
        axiosInstance().get('/matches/' + this.props.id)
            .then(response => {
                console.log(response);
                if (response.data) {
                    //console.log('set');
                    const homeOddIndex = response.data.homeOdd.findIndex((item: any) => item.tournamentId === this.props.tournamentId);
                    const tieOddIndex = response.data.tieOdd.findIndex((item: any) => item.tournamentId === this.props.tournamentId);
                    const awayOddIndex = response.data.awayOdd.findIndex((item: any) => item.tournamentId === this.props.tournamentId);
                    const homeWinUsersIndex = response.data.homeWinUsers.findIndex((item: any) => item.tournamentId === this.props.tournamentId);
                    const tieUsersIndex = response.data.tieUsers.findIndex((item: any) => item.tournamentId === this.props.tournamentId);
                    const awayWinUsersIndex = response.data.awayWinUsers.findIndex((item: any) => item.tournamentId === this.props.tournamentId);
                    console.log(tieUsersIndex);
                    this.setState({
                        homeOdd: homeOddIndex > -1 ? response.data.homeOdd[homeOddIndex].value : '',
                        tieOdd: tieOddIndex > -1 ? response.data.tieOdd[tieOddIndex].value: '',
                        awayOdd: awayOddIndex > -1 ? response.data.awayOdd[awayOddIndex].value : '',
                        homeWinUsers: response.data.homeWinUsers,
                        tieUsers: response.data.tieUsers,
                        awayWinUsers: response.data.awayWinUsers
                    });
                    this.getMatchScore();
                }
            });
        if (this.props.oddsSource !== 'Manual') {
            this.getMatchOdds();
        }

        // // @ts-ignore
        // this.oddsInterval = setTimeout(() => {
        //     this.submitOdds();
        // }, 10000);

        // @ts-ignore
        this.interval = setInterval(() => {
            this.getMatchScore();
        }, 300000);//evert 5 minutes
    };

    getMatchOdds = () => {
        const headers = {
            "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
            "x-rapidapi-key": "caf2d8bb45msh890d53234504df6p11bfa9jsn11476be6f67b"
        };

        axios.get('https://api-football-v1.p.rapidapi.com/v2/odds/fixture/' + this.props.id, {headers})
            .then(response => {
                console.log(this.props.oddsSource);
                console.log(response);
                let bookmakers = response.data.api.odds[0].bookmakers;
                console.log(bookmakers);
                for(let i = 0; bookmakers.length; i++){
                    if (bookmakers[i].bookmaker_name === this.props.oddsSource){
                        let bookmakerBets = bookmakers[i].bets;
                        console.log(bookmakerBets);
                        for(let j = 0; j < bookmakerBets.length; j++){
                            if (bookmakerBets[j].label_name === 'Match Winner'){
                                let matchWinnerOdds = bookmakerBets[j].values;
                                let matchOdds = {
                                    homeOdd: '',
                                    tieOdd: '',
                                    awayOdd: ''
                                };
                                console.log(matchWinnerOdds);
                                for(let k = 0; k <matchWinnerOdds.length; k++){
                                    if (matchWinnerOdds[k].value === 'Home'){
                                        matchOdds.homeOdd = matchWinnerOdds[k].odd;
                                    } else if(matchWinnerOdds[k].value === 'Draw'){
                                        matchOdds.tieOdd = matchWinnerOdds[k].odd;
                                    } else if(matchWinnerOdds[k].value === 'Away'){
                                        matchOdds.awayOdd = matchWinnerOdds[k].odd;
                                    }
                                }
                                this.setState({homeOdd: matchOdds.homeOdd, tieOdd: matchOdds.tieOdd, awayOdd: matchOdds.awayOdd});
                            }
                        }
                        break;
                    }
                }
                this.submitOdds();
            })
            .catch(err => {console.log(err)});
    };

    getMatchScore = () => {
        if (!this.state.ft) {
            console.log(this.props.homeTeamName + ' - ' + this.props.awayTeamName + ': fetching....');
            const headers = {
                "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
                "x-rapidapi-key": "caf2d8bb45msh890d53234504df6p11bfa9jsn11476be6f67b"
            };
            axios.get('https://api-football-v1.p.rapidapi.com/v2/fixtures/id/' + this.props.id, {headers})
                .then(response => {
                    //console.log(response);
                    if (response.data.api.fixtures[0].statusShort !== 'NS') {
                        let goalsHomeTeam = response.data.api.fixtures[0].goalsHomeTeam;
                        let goalsAwayTeam = response.data.api.fixtures[0].goalsAwayTeam;
                        if (goalsHomeTeam > goalsAwayTeam) {
                            this.setState({
                                isHomeWin: true,
                                isAwayWin: false,
                                isTie: false,
                                ns: false,
                                goalsHomeTeam: goalsHomeTeam,
                                goalsAwayTeam: goalsAwayTeam
                            });
                        } else if (goalsHomeTeam < goalsAwayTeam) {
                            this.setState({
                                isHomeWin: false,
                                isAwayWin: true,
                                isTie: false,
                                ns: false,
                                goalsHomeTeam: goalsHomeTeam,
                                goalsAwayTeam: goalsAwayTeam
                            });
                        } else {
                            this.setState({
                                isHomeWin: false,
                                isAwayWin: false,
                                isTie: true,
                                ns: false,
                                goalsHomeTeam: goalsHomeTeam,
                                goalsAwayTeam: goalsAwayTeam
                            });
                        }

                        // console.log('goalsHomeTeam: ' + goalsHomeTeam);
                        //  console.log('goalsAwayTeam: ' + goalsAwayTeam);
                        this.updateMatchScore(goalsHomeTeam, goalsAwayTeam);
                    }
                })
                .catch(err => {
                    console.log(err)
                });
        }
        else {
            console.log('match between ' + this.props.homeTeamName + ' and ' + this.props.awayTeamName + ' is already in the database!!');
        }
    };

    updateMatchScore = (goalsHomeTeam: number, goalsAwayTeam: number) => {
        axiosInstance().put('/matches/' + this.props.id + '/result', {goalsHomeTeam: goalsHomeTeam, goalsAwayTeam: goalsAwayTeam})
            .then(response => {console.log(response)})
            .catch(err => {console.log(err)});
    };


    componentDidUpdate(prevProps: Readonly<MatchProps>, prevState: Readonly<{}>, snapshot?: any): void {

       // console.log('mathc upadted!! ' + this.props.selectedUser + ' ' + this.props.leagueId);
        if (prevProps.selectedUser !== this.props.selectedUser || this.state.selectionChanged || prevProps.leagueId !== this.props.leagueId) {
            axiosInstance().get('/matches/' + this.props.id)
                .then(response => {
                  //  console.log(response);
                    let selectionHasChanged = true;
                    if (prevProps.selectedUser === this.props.selectedUser){
                        selectionHasChanged = false;
                    }
                    this.setState({
                        userChoseAway: response.data.awayWinUsers.findIndex((item: any) => item.name === this.props.selectedUser && item.tournamentId === this.props.tournamentId) > -1,
                        userChoseHome: response.data.homeWinUsers.findIndex((item: any) => item.name === this.props.selectedUser && item.tournamentId === this.props.tournamentId) > -1,
                        userChoseTie: response.data.tieUsers.findIndex((item: any) => item.name === this.props.selectedUser && item.tournamentId === this.props.tournamentId) > -1,
                        selectionChanged: selectionHasChanged
                    });
                })
                .catch(err => {
                    console.log('Error: ' + err)
                });
        }
        if (!prevProps.isExist && this.props.isExist){
            console.log('updated!! Exists!!');
            this.initiate();
        }
        if (!prevProps.isOver && this.props.isOver){
            const isHomeWin = this.props.homeGoals > this.props.awayGoals;
            const isTie = this.props.homeGoals === this.props.awayGoals;
            const isAwayWin = this.props.homeGoals < this.props.awayGoals;
            this.setState({ns: false ,ft: true, goalsHomeTeam: this.props.homeGoals, goalsAwayTeam: this.props.awayGoals, isHomeWin: isHomeWin, isTie: isTie, isAwayWin: isAwayWin});
        }
    }

    // componentWillUpdate(nextProps: Readonly<MatchProps>, nextState: Readonly<{}>, nextContext: any): void {
    //     console.log('mathc upadted!! ' + this.props.selectedUser + ' ' + this.props.leagueId);
    //     if (nextProps.selectedUser !== this.props.selectedUser || this.state.selectionChanged || nextProps.leagueId !== this.props.leagueId) {
    //         axiosInstance().get('/matches/' + this.props.id)
    //             .then(response => {
    //                 console.log(response);
    //                 let selectionHasChanged = true;
    //                 if (nextProps.selectedUser === this.props.selectedUser){
    //                     selectionHasChanged = false;
    //                 }
    //                 this.setState({
    //                     userChoseAway: response.data.awayWinUsers.indexOf(nextProps.selectedUser) > -1,
    //                     userChoseHome: response.data.homeWinUsers.indexOf(nextProps.selectedUser) > -1,
    //                     userChoseTie: response.data.tieUsers.indexOf(nextProps.selectedUser) > -1,
    //                     selectionChanged: selectionHasChanged
    //                 });
    //             })
    //             .catch(err => {
    //                 console.log('Error: ' + err)
    //             });
    //     }
    // }

    toggleEditMode = () => {
        const editMode = this.state.editMode;
        if (editMode){
            this.submitOdds();
        } else {
            this.setState({editMode: true});
        }
    };

    handleHomeOddChange = ({currentTarget: {value}}: React.SyntheticEvent<HTMLInputElement>) => {
        this.setState({homeOdd: value})
    };

    handleTieOddChange = ({currentTarget: {value}}: React.SyntheticEvent<HTMLInputElement>) => {
        this.setState({tieOdd: value})
    };

    handleAwayOddChange = ({currentTarget: {value}}: React.SyntheticEvent<HTMLInputElement>) => {
        this.setState({awayOdd: value})
    };

    submitOdds = () => {
        console.log(this.state.homeOdd);
        console.log(this.state.tieOdd);
        console.log(this.state.awayOdd);
        this.setState({editMode: false});
        const homeOdd = {value: +this.state.homeOdd, tournamentId: this.props.tournamentId, source: this.props.oddsSource};
        const tieOdd = {value: +this.state.tieOdd, tournamentId: this.props.tournamentId, source: this.props.oddsSource};
        const awayOdd = {value: +this.state.awayOdd, tournamentId: this.props.tournamentId, source: this.props.oddsSource};
            axiosInstance().put('/matches/' + this.props.id + '/odds', {
                homeOdd: homeOdd,
                tieOdd: tieOdd,
                awayOdd: awayOdd
            })
                .then(response => {
                    console.log(response);
                })
                .catch(err => {
                    console.log(err)
                });
    };

    pushUserToHomeWin = () => {

        if (this.props.selectedUser) {
                console.log('selected');
                console.log(this.state.homeWinUsers);
                let homeWinUsers = [...this.state.homeWinUsers];
                // @ts-ignore
                let indexHomeWin = homeWinUsers.findIndex((item: any) => item.name === this.props.selectedUser && item.tournamentId === this.props.tournamentId);
                if (indexHomeWin === -1) {
                    let tieUsers = [...this.state.tieUsers];
                    let awayWinUsers = [...this.state.awayWinUsers];

                    // @ts-ignore
                    let indexTie = tieUsers.findIndex((item: any) => item.name === this.props.selectedUser && item.tournamentId === this.props.tournamentId);
                    if (indexTie > -1) {
                        tieUsers.splice(indexTie, 1);
                    } else {
                        // @ts-ignore
                        let indexAwayWin = awayWinUsers.findIndex((item: any) => item.name === this.props.selectedUser && item.tournamentId === this.props.tournamentId);
                        if (indexAwayWin > -1) {
                            awayWinUsers.splice(indexAwayWin, 1);
                        }
                    }
                    // @ts-ignore
                    homeWinUsers.push({name: this.props.selectedUser, tournamentId: this.props.tournamentId});
                    axiosInstance().put('/matches/' + this.props.id + '/bet', {
                        homeWinUsers,
                        awayWinUsers,
                        tieUsers
                    })
                        .then(response => {
                            console.log(response);
                            console.log('pushed ' + this.props.selectedUser + ' to home Win!');
                            this.setState({
                                homeWinUsers: response.data.homeWinUsers,
                                awayWinUsers: response.data.awayWinUsers,
                                tieUsers: response.data.tieUsers,
                                selectionChanged: true
                            });
                        })
                        .catch(err => console.log('Error: ' + err));
                }
            }
    };

    pushUserToAwayWin = () => {
        if (this.props.selectedUser) {
            console.log('selected');
            let awayWinUsers = [...this.state.awayWinUsers];
            // @ts-ignore
            let indexAwayWin = awayWinUsers.findIndex((item: any) => item.name === this.props.selectedUser && item.tournamentId === this.props.tournamentId);
            if (indexAwayWin === -1) {
                let tieUsers = [...this.state.tieUsers];
                let homeWinUsers = [...this.state.homeWinUsers];

                // @ts-ignore
                let indexTie = tieUsers.findIndex((item: any) => item.name === this.props.selectedUser && item.tournamentId === this.props.tournamentId);
                if (indexTie > -1) {
                    tieUsers.splice(indexTie, 1);
                } else {
                    // @ts-ignore
                    let indexHomeWin = homeWinUsers.findIndex((item: any) => item.name === this.props.selectedUser && item.tournamentId === this.props.tournamentId);
                    if (indexHomeWin > -1) {
                        homeWinUsers.splice(indexHomeWin, 1);
                    }
                }
                // @ts-ignore
                awayWinUsers.push({name: this.props.selectedUser, tournamentId: this.props.tournamentId});
                axiosInstance().put('/matches/' + this.props.id + '/bet', {
                    homeWinUsers,
                    awayWinUsers,
                    tieUsers
                })
                    .then(response => {
                        console.log(response);
                        console.log('pushed ' + this.props.selectedUser + ' to AWAY Win!');
                        this.setState({
                            homeWinUsers: response.data.homeWinUsers,
                            awayWinUsers: response.data.awayWinUsers,
                            tieUsers: response.data.tieUsers,
                            selectionChanged: true
                        });
                    })
                    .catch(err => console.log('Error: ' + err));
            }
        }
    };

    pushUserToTie = () => {
        if (this.props.selectedUser) {
            console.log('selected');
            let tieUsers = [...this.state.tieUsers];
            // @ts-ignore
            let indexTieWin = tieUsers.findIndex((item: any) => item.name === this.props.selectedUser && item.tournamentId === this.props.tournamentId);
            if (indexTieWin === -1) {
                let awayWinUsers = [...this.state.awayWinUsers];
                let homeWinUsers = [...this.state.homeWinUsers];

                // @ts-ignore
                let indexAway = awayWinUsers.findIndex((item: any) => item.name === this.props.selectedUser && item.tournamentId === this.props.tournamentId);
                if (indexAway > -1) {
                    awayWinUsers.splice(indexAway, 1);
                } else {
                    // @ts-ignore
                    let indexHomeWin = homeWinUsers.findIndex((item: any) => item.name === this.props.selectedUser && item.tournamentId === this.props.tournamentId);
                    if (indexHomeWin > -1) {
                        homeWinUsers.splice(indexHomeWin, 1);
                    }
                }
                // @ts-ignore
                tieUsers.push({name: this.props.selectedUser, tournamentId: this.props.tournamentId});
                axiosInstance().put('/matches/' + this.props.id + '/bet', {
                    homeWinUsers,
                    awayWinUsers,
                    tieUsers
                })
                    .then(response => {
                        console.log(response);
                        console.log('pushed ' + this.props.selectedUser + ' to TIE Win!');
                        this.setState({
                            homeWinUsers: response.data.homeWinUsers,
                            awayWinUsers: response.data.awayWinUsers,
                            tieUsers: response.data.tieUsers,
                            selectionChanged: true
                        });
                    })
                    .catch(err => console.log('Error: ' + err));
            }
        }
    };


    render() {
        // @ts-ignore
        // @ts-ignore
        // @ts-ignore
        return (
            <div className={classes.matchContainer}>
                    <Button onClick={this.pushUserToHomeWin} basic color={
                        (this.state.userChoseHome &&  this.state.isHomeWin) ? 'green' : (this.state.userChoseHome && !this.state.ns) ? 'red' : 'black'}
                            primary={this.state.ns && this.state.userChoseHome}>
                        <div className={classes.resultOption}>
                            <div>{this.props.homeTeamName}{!this.state.ns ? '(' + this.state.goalsHomeTeam + ')' : null}</div>
                            {this.state.editMode ?
                                <input value={this.state.homeOdd} onChange={this.handleHomeOddChange}/>
                                :
                                <div>
                                    {this.state.homeOdd}
                                </div>
                            }
                        </div>
                    </Button>
                    <Button onClick={this.pushUserToTie} basic color={
                        (this.state.userChoseTie &&  this.state.isTie) ? 'green' : (this.state.userChoseTie && !this.state.ns) ? 'red' : 'black'}
                            primary={this.state.ns && this.state.userChoseTie}>
                        <div className={classes.resultOption} style={{minWidth: '150px'}}>
                            <div>X</div>
                            {this.state.editMode ?
                                <input value={this.state.tieOdd} onChange={this.handleTieOddChange}/>
                                :
                                <div>
                                    {this.state.tieOdd}
                                </div>
                            }
                        </div>
                    </Button>
                    <Button onClick={this.pushUserToAwayWin} basic color={
                        (this.state.userChoseAway &&  this.state.isAwayWin) ? 'green' : (this.state.userChoseAway && !this.state.ns) ? 'red' : 'black'}
                        primary={this.state.ns && this.state.userChoseAway}>
                            <div className={classes.resultOption}>
                                <div>{this.props.awayTeamName}{!this.state.ns ? '(' + this.state.goalsAwayTeam + ')' : null}</div>
                                {this.state.editMode ?
                                    <input value={this.state.awayOdd} onChange={this.handleAwayOddChange}/>
                                    :
                                    <div>
                                        {this.state.awayOdd}
                                    </div>
                                }
                        </div>
                    </Button>
                    <Button onClick={this.toggleEditMode} icon>
                        <Icon name={this.state.editMode ? 'check' : 'edit'}/>
                    </Button>
                    {/*<Button onClick={this.submitOdds}>Submit</Button>*/}
                {/*{!this.state.ns ?*/}
                {/*    <div>{this.state.goalsHomeTeam} - {this.state.goalsAwayTeam}</div>*/}
                {/*     : null}*/}
            </div>
        );
    }
}

export default Match;
