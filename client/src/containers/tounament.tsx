import React, {Component} from 'react';
//import Aux from '../../hoc/Auxilary/Auxilary';
//import Burger from '../../components/Burger/Burger';
//import BuildControls from '../../components/Burger/BuildControls/BuildControls';
//import Modal from '../../components/UI/Modal/Modal';
//import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from 'axios';
//import Spinner from '../../components/UI/Spinner/Spinner';
//import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
//import {connect} from 'react-redux';
import User from "../components/user";
import Match from "../components/match";
import {Button, Form} from "semantic-ui-react";

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

class Tournament extends Component {
    private weeklyScoreinterval : number | undefined;
    private currMatchesInterval : number | undefined;
    private usersInterval : number | undefined;

    state = {
       users: [],
       currResult: 0,
        currFixtures: [],
        selectedUser: '',
        usernameToAddName: '',
        usernameToAddScore: 0,
        currMatches: []
    };

    componentDidMount() {
        // @ts-ignore
        this.usersInterval = setInterval(() => {
            this.getUsers();
        }, 5000);
        this.getCurrentRound();
        // @ts-ignore
        this.currMatchesInterval = setInterval(() => {
            this.getMatches();
        }, 5000);
        // @ts-ignore
        this.weeklyScoreinterval = setInterval(() => {
            this.calculateWeeklyScore();
        }, 5000);
    }

    componentDidUpdate(): void {
        console.log('UPDATE');
        this.calculateWeeklyScore();
    }

    componentWillUnmount(): void {
        clearInterval(this.weeklyScoreinterval);
        clearInterval(this.currMatchesInterval);
        clearInterval(this.usersInterval);
    }

    addMatch = (matchId: any, homeTeamName: any, awayTeamName: any) => {
      axios.post('/matches/add', {matchId: matchId, homeTeamName: homeTeamName, awayTeamName: awayTeamName})
          .then(response => {console.log(response)})
          .catch(err => {console.log('Error: ' + err)});
    };

    getCurrentRound = () => {
        const headers = {
            "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
            "x-rapidapi-key": "caf2d8bb45msh890d53234504df6p11bfa9jsn11476be6f67b"
        };

        axios.get('https://api-football-v1.p.rapidapi.com/v2/fixtures/rounds/637/current', {headers})
            .then(response => {
                console.log(response.data.api.fixtures[0]);
                let currentRound = response.data.api.fixtures[0];
                this.getCurrRoundMatches(currentRound);
            })
            .catch(err => console.log(err));
    };

    getUsers = () => {
        axios.get('/users')
            .then(response => {
                console.log(response);
                this.setState({users: response.data});
            })
            .catch(err => {console.log(err)});
    };

    getMatches = () => {
        const port = process.env.PORT || 5000;
        axios.get('/matches')
            .then(response => {
               // console.log(response);
                this.setState({currMatches: response.data});
            })
            .catch(err => {console.log(err)});
    };

    setCurrentDatabase = () => {
        console.log('SETTING');
        axios.get('/matches')
            .then(response => {
                console.log(response.data);
                let matchesCreated = response.data.length > 0;
                if (!matchesCreated){
                    for(let i = 0; i < this.state.currFixtures.length; i++){
                        // @ts-ignore
                        console.log(this.state.currFixtures[i].fixture_id);
                        // @ts-ignore
                        let matchId = this.state.currFixtures[i].fixture_id;
                        // @ts-ignore
                        let homeTeamName = this.state.currFixtures[i].homeTeam.team_name;
                        // @ts-ignore
                        let awayTeamName = this.state.currFixtures[i].awayTeam.team_name;
                        this.addMatch(matchId, homeTeamName, awayTeamName);
                        //this.addMatch(this.state.currFixtures[i].fixture_id);
                    }
                }
                console.log(matchesCreated);
            })
            .catch(err => {console.log('Error: ' + err)});
    };

    getCurrRoundMatches = (currentRound: string) => {
        const headers = {
            "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
            "x-rapidapi-key": "caf2d8bb45msh890d53234504df6p11bfa9jsn11476be6f67b"
        };

        axios.get('https://api-football-v1.p.rapidapi.com/v2/fixtures/league/637/' + currentRound, {headers})
            .then(response => {
                console.log(response.data.api);
                console.log(response.data.api.fixtures[0].homeTeam.team_name);
                this.setState({currFixtures: response.data.api.fixtures});
                this.setCurrentDatabase();
                console.log(this.state.currFixtures);

            })
            .catch(err => console.log(err));
    };


    selectedUserChanged = (event: any) => {
        console.log(event.target.value);
        this.setState({selectedUser: event.target.value});
    };

    newUserScoreChanged = ({currentTarget: {value}}: React.SyntheticEvent<HTMLInputElement>) => {
        this.setState({usernameToAddScore: value});
    };

    newUsernameChanged = ({currentTarget: {value}}: React.SyntheticEvent<HTMLInputElement>) => {
        this.setState({usernameToAddName: value});
    };

    addUser = () => {
        axios.post('/users/newUser', {
            username: this.state.usernameToAddName,
            totalScore: this.state.usernameToAddScore,
            weeklyScore: 0
        })
            .then(response => {console.log(response)})
            .catch(err => {console.log(err)});

    };

    calculateWeeklyScore = () => {
        let users : User []  = [...this.state.users];
        let matches : MatchType [] = [...this.state.currMatches];
        console.log(users);
        console.log(matches);
        for (let i = 0; i < users.length; i++){
            // @ts-ignore
            users[i].weeklyScore = 0;
            for(let j = 0; j < matches.length; j++){
                //console.log(matches[j]);
                // @ts-ignore
                if (matches[j].goalsHomeTeam !== null) {
                    if (matches[j].goalsHomeTeam > matches[j].goalsAwayTeam) {
                        // @ts-ignore
                        if (matches[j].homeWinUsers.indexOf(users[i].name) > -1) {
                            // @ts-ignore
                            users[i].weeklyScore = +parseFloat((users[i].weeklyScore + matches[j].homeOdd).toFixed(2));

                            // @ts-ignore
                            console.log(matches[j]);
                            console.log(users[i].name, matches[j].homeOdd, matches[j].homeTeamName);
                        }
                    } else if (matches[j].goalsHomeTeam < matches[j].goalsAwayTeam) {
                        // @ts-ignore
                        if (matches[j].awayWinUsers.indexOf(users[i].name) > -1) {
                            // @ts-ignore
                            users[i].weeklyScore = +parseFloat((users[i].weeklyScore + matches[j].awayOdd).toFixed(2));
                            console.log(users[i].name, matches[j].awayOdd, matches[j].awayTeamName);
                        }
                    } else if (matches[j].goalsHomeTeam === matches[j].goalsAwayTeam) {
                        // @ts-ignore
                        if (matches[j].tieUsers.indexOf(users[i].name) > -1) {
                            // @ts-ignore
                            users[i].weeklyScore = +parseFloat((users[i].weeklyScore + matches[j].tieOdd).toFixed(2));
                            console.log(matches[j]);
                            console.log(users[i].name, matches[j].tieOdd);
                        }
                    }
                }
            }
            // @ts-ignore
            this.updateUserScore(users[i]._id, users[i].weeklyScore);
        }
    };

    updateUserScore = (userId: string, weeklyScore: number) => {
        axios.put('/users/' + userId + '/updateScore', {weeklyScore: weeklyScore})
            .then(response => {
                //console.log(response)
            })
            .catch(err => {console.log(err)});
    };

    render() {
        // @ts-ignore
        return (
           <div>
               <Form>
                   <Form.Field>
                       <label>Username</label>
                       <input placeholder='Full name' value={this.state.usernameToAddName} onChange={this.newUsernameChanged}/>
                   </Form.Field>
                   <Form.Field>
                       <label>Initial score</label>
                       <input placeholder='score' value={this.state.usernameToAddScore} onChange={this.newUserScoreChanged}/>
                   </Form.Field>
                   <Button type='submit' onClick={this.addUser}>Submit</Button>
               </Form>
               <select onChange={this.selectedUserChanged} value={this.state.selectedUser}>
                   <option value="" selected disabled hidden>Choose here</option>
                   {this.state.users.map((user: User) =>  <option value={user.name}>{user.name}</option>)}
               </select>
               {this.state.users.map((user: User) =>
               <User name={user.name} totalScore={user.totalScore} weeklyScore={user.weeklyScore} key={user.name}/> )}
               {this.state.currFixtures.map((match: any) =>
               <Match id={match.fixture_id} homeTeamName={match.homeTeam.team_name} awayTeamName={match.awayTeam.team_name} key={match.fixture_id} selectedUser={this.state.selectedUser}/>)}
           </div>
        );
    }
}

// const mapStateToProps = state => {
//     return {
//         ing: state.ingredients,
//         price: state.totalPrice
//     };
// };

// const mapDispatchToProps = dispatch => {
//     return {
//         onIngredientAdded: (ingName) => dispatch({type: actionTypes.ADD_INGREDIENT, ingredientName: ingName }),
//         onIngredientRemove: (ingName) => dispatch({type: actionTypes.REMOVE_INGREDIENT, ingredientName: ingName})
//     }
// };

export default Tournament;
