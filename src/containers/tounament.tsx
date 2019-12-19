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


class Tournament extends Component {
    state = {
       users: [{name: 'uri', score: 0, choice: 1},{name: 'yarden', score: 0, choice: 2}, {name: 'kfir', score: 0, choice: 0}],
       currResult: 0
    };

    componentDidMount() {
        const headers = {
            "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
            "x-rapidapi-key": "caf2d8bb45msh890d53234504df6p11bfa9jsn11476be6f67b"
        };

        axios.get('https://api-football-v1.p.rapidapi.com/v2/fixtures/id/154450', {headers})
            .then(response => {
                //const updatedScores = updateScore();
                console.log(response);
                let currentScore = 0;
                const homeScore = response.data.api.fixtures[0].goalsHomeTeam;
                const awayScore = response.data.api.fixtures[0].goalsAwayTeam;
                if (homeScore > awayScore){
                    currentScore = 1;
                }else if (awayScore > homeScore){
                    currentScore = 2;
                }
                console.log(homeScore + ':' + awayScore);
                console.log(currentScore);
                this.setState((prevState, props) => {
                    return {users: this.updateScore(prevState,props, currentScore)}
                });
            })
            .catch(error => {console.log('error: ' + error)});
    }

    updateScore = (prevState: any, props: any, currentScore: number) => {
        if (prevState.currResult === currentScore) {
            return prevState.users;
        }
        else {
            let users = [...this.state.users];
            console.log(users);
            console.log(currentScore);
            for (let i = 0; i < users.length; i++) {
                console.log(users[i]);
                if((users[i].choice == prevState.currResult) && (users[i].choice != currentScore)){
                    console.log('here');
                    users[i].score = users[i].score - 2;
                }
                else if((users[i].choice !== prevState.currResult) && (users[i].choice === currentScore)){
                    users[i].score = users[i].score + 3;
                }
            }
            console.log(users);
            return users;
        }
    };




    render() {
        return (
           <div>
               {this.state.users.map(user =>
               <User name={user.name} score={user.score} choice={user.choice} key={user.name}/> )}
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
