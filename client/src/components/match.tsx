import React, {Component} from 'react';
import {Button} from "semantic-ui-react";
import axios from 'axios';
import axiosInstance from '../axios';
import classes from './match.module.css';

interface MatchProps {
    id: number,
    homeTeamName: string,
    awayTeamName: string,
    homeGoals?: string,
    awayGoals?: string,
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
}

class Match extends Component<MatchProps> {
    private interval : number | undefined;

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
        ns: true
    };

    componentDidMount() {
        axiosInstance().get('/matches/' + this.props.id)
            .then(response => {
               // console.log(response);
                if (response.data) {
                    //console.log('set');

                    this.setState({
                        homeOdd: response.data.homeOdd,
                        tieOdd: response.data.tieOdd,
                        awayOdd: response.data.awayOdd,
                        homeWinUsers: response.data.homeWinUsers,
                        tieUsers: response.data.tieUsers,
                        awayWinUsers: response.data.awayWinUsers
                    });
                    this.getMatchScore();
                }
            });



        // @ts-ignore
        this.interval = setInterval(() => {
            this.getMatchScore();
        }, 300000);//evert 5 minutes

        // if (this.props.odds?.HomeWin && this.props.odds?.Tie && this.props.odds?.AwayWin) {
        //     this.setState({editMode: false});
        // }
    }

    componentWillUnmount(): void {
        clearInterval(this.interval);
    }

    getMatchScore = () => {
        const headers = {
            "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
                "x-rapidapi-key": "caf2d8bb45msh890d53234504df6p11bfa9jsn11476be6f67b"
        };
        axios.get('https://api-football-v1.p.rapidapi.com/v2/fixtures/id/' + this.props.id, {headers})
            .then(response => {
                //console.log(response);
                if (response.data.api.fixtures[0].statusShort !== 'NS'){
                    let goalsHomeTeam = response.data.api.fixtures[0].goalsHomeTeam;
                    let goalsAwayTeam = response.data.api.fixtures[0].goalsAwayTeam;
                    if (goalsHomeTeam > goalsAwayTeam){
                        this.setState({isHomeWin: true, isAwayWin: false, isTie: false, ns: false, goalsHomeTeam: goalsHomeTeam, goalsAwayTeam: goalsAwayTeam});
                    }
                    else if (goalsHomeTeam < goalsAwayTeam){
                        this.setState({isHomeWin: false, isAwayWin: true, isTie: false, ns: false,  goalsHomeTeam: goalsHomeTeam, goalsAwayTeam: goalsAwayTeam});
                    }
                    else {
                        this.setState({isHomeWin: false, isAwayWin: false, isTie: true, ns: false,  goalsHomeTeam: goalsHomeTeam, goalsAwayTeam: goalsAwayTeam});
                    }

                   // console.log('goalsHomeTeam: ' + goalsHomeTeam);
                  //  console.log('goalsAwayTeam: ' + goalsAwayTeam);
                    this.updateMatchScore(goalsHomeTeam, goalsAwayTeam);
                }
            })
            .catch(err => {console.log(err)});
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
                        userChoseAway: response.data.awayWinUsers.indexOf(this.props.selectedUser) > -1,
                        userChoseHome: response.data.homeWinUsers.indexOf(this.props.selectedUser) > -1,
                        userChoseTie: response.data.tieUsers.indexOf(this.props.selectedUser) > -1,
                        selectionChanged: selectionHasChanged
                    });
                })
                .catch(err => {
                    console.log('Error: ' + err)
                });
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
        this.setState({editMode: !this.state.editMode});
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
        this.setState({editMode: false});
        axiosInstance().put('/matches/' + this.props.id + '/odds', {
            homeOdd: this.state.homeOdd,
            tieOdd: this.state.tieOdd,
            awayOdd: this.state.awayOdd
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
            let homeWinUsers = [...this.state.homeWinUsers];
            // @ts-ignore
            let indexHomeWin = homeWinUsers.indexOf(this.props.selectedUser);
            if (indexHomeWin === -1) {
                let tieUsers = [...this.state.tieUsers];
                let awayWinUsers = [...this.state.awayWinUsers];

                // @ts-ignore
                let indexTie = tieUsers.indexOf(this.props.selectedUser);
                if (indexTie > -1) {
                    tieUsers.splice(indexTie, 1);
                } else {
                    // @ts-ignore
                    let indexAwayWin = awayWinUsers.indexOf(this.props.selectedUser);
                    if (indexAwayWin > -1) {
                        awayWinUsers.splice(indexAwayWin, 1);
                    }
                }
                // @ts-ignore
                homeWinUsers.push(this.props.selectedUser);
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
            let indexAwayWin = awayWinUsers.indexOf(this.props.selectedUser);
            if (indexAwayWin === -1) {
                let tieUsers = [...this.state.tieUsers];
                let homeWinUsers = [...this.state.homeWinUsers];

                // @ts-ignore
                let indexTie = tieUsers.indexOf(this.props.selectedUser);
                if (indexTie > -1) {
                    tieUsers.splice(indexTie, 1);
                } else {
                    // @ts-ignore
                    let indexHomeWin = homeWinUsers.indexOf(this.props.selectedUser);
                    if (indexHomeWin > -1) {
                        homeWinUsers.splice(indexHomeWin, 1);
                    }
                }
                // @ts-ignore
                awayWinUsers.push(this.props.selectedUser);
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
            let indexTieWin = tieUsers.indexOf(this.props.selectedUser);
            if (indexTieWin === -1) {
                let awayWinUsers = [...this.state.awayWinUsers];
                let homeWinUsers = [...this.state.homeWinUsers];

                // @ts-ignore
                let indexAway = awayWinUsers.indexOf(this.props.selectedUser);
                if (indexAway > -1) {
                    awayWinUsers.splice(indexAway, 1);
                } else {
                    // @ts-ignore
                    let indexHomeWin = homeWinUsers.indexOf(this.props.selectedUser);
                    if (indexHomeWin > -1) {
                        homeWinUsers.splice(indexHomeWin, 1);
                    }
                }
                // @ts-ignore
                tieUsers.push(this.props.selectedUser);
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
            <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                    <Button onClick={this.pushUserToHomeWin} basic color={
                        (this.state.userChoseHome &&  this.state.isHomeWin) ? 'green' : (this.state.userChoseHome && !this.state.ns) ? 'red' : 'black'}
                            primary={this.state.ns && this.state.userChoseHome}>
                        <div className={classes.resultOption}>
                            <div>{this.props.homeTeamName}</div>
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
                        <div className={classes.resultOption + ' ' + classes.tieOption}>
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
                                <div>{this.props.awayTeamName}</div>
                                {this.state.editMode ?
                                    <input value={this.state.awayOdd} onChange={this.handleAwayOddChange}/>
                                    :
                                    <div>
                                        {this.state.awayOdd}
                                    </div>
                                }
                        </div>
                    </Button>
                    <Button onClick={this.toggleEditMode}>Edit</Button>
                    <Button onClick={this.submitOdds}>Submit</Button>
                {!this.state.ns ?
                    <div>{this.state.goalsHomeTeam} - {this.state.goalsAwayTeam}</div>
                     : null}
            </div>
        );
    }
}

export default Match;
