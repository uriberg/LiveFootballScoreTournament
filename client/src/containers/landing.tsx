import React, {Component} from 'react';
import axiosInstance from '../axios';
import {Button, Form} from "semantic-ui-react";
import Tournament from "./tournament";

const options = [
    {key: 'I', text: 'Israeli League', value: 'israeli league'},
    {key: 'P', text: 'Premier League', value: 'premier league'},
];


class Landing extends Component {


    state = {
        createMode: false,
        tournamentName: '',
        tournamentLeagueId: 637,
        username: '',
        totalScore: 0,
        tournamentUsers: [],
        showTournament: false,
        tournamentsArray: [],
        tournamentId: '',
        lastRecordedRound: ''
    };

    turnOnCreateMode = () => {
        this.setState({createMode: true});
    };

    createTournament = () => {
        console.log('tournamentName: ', this.state.tournamentName);
        console.log('leagueId: ', this.state.tournamentLeagueId);
        console.log('tournamentUsers: ', this.state.tournamentUsers);
        const newTournament = {
          tournamentName: this.state.tournamentName,
          tournamentLeagueId: this.state.tournamentLeagueId,
          tournamentUsers: this.state.tournamentUsers
        };
        axiosInstance().post('/tournaments/newTournament', {newTournament})
            .then((response: any) => {
                console.log(response);
                this.setState({createMode: false, showTournament: true, tournamentId: response.data._id});
            })
            .catch((err: any) => {console.log(err)});
    };

    fetchTournaments = () => {
        axiosInstance().get('/tournaments')
            .then(response => {
                console.log(response);
                this.setState({tournamentsArray: response.data});
            })
            .catch(err => {console.log(err)});
    };

    tournamentNameChanged = ({currentTarget: {value}}: React.SyntheticEvent<HTMLInputElement>) => {
        this.setState({tournamentName: value});
    };

    usernameChanged = ({currentTarget: {value}}: React.SyntheticEvent<HTMLInputElement>) => {
        this.setState({username: value});
    };

    totalScoreChanged = ({currentTarget: {value}}: React.SyntheticEvent<HTMLInputElement>) => {
        this.setState({totalScore: value});
    };

    addUser = () => {
        const newUser = {
            name: this.state.username,
            totalScore: this.state.totalScore,
            weeklyScore: 0
        };
        const tournamentUsersArray: any[] = [...this.state.tournamentUsers];
        tournamentUsersArray.push(newUser);
        this.setState({tournamentUsers: tournamentUsersArray, username: '', totalScore: 0});
        console.log(tournamentUsersArray);
    };

    selectedLeagueChanged = (event: any, {value}: any) => {
        console.log(value);
        if (value === 'israeli league') {
            this.setState({tournamentLeagueId: 637})
        } else if (value === 'premier league') {
            this.setState({tournamentLeagueId: 524})
        }
        //this.setState({selectedLeague: event.target.value});
    };

    getTournament = (id: string) => {
        axiosInstance().get('/tournaments/' + id)
            .then(response => {
                console.log(response);
                this.setState({
                    tournamentName: response.data.tournamentName,
                    tournamentLeagueId: response.data.tournamentLeagueId,
                    tournamentUsers: response.data.tournamentUsers,
                    tournamentId: id,
                    lastRecordedRound: response.data.lastRecordedRound,
                    showTournament: true
                });
            })
            .catch(err => {console.log(err)});
        //console.log(event.target._id);
    };

    render() {
        const tournamentsList =  this.state.tournamentsArray.map((tournament: any) =>
                <Button value={tournament._id} onClick={() => this.getTournament(tournament._id)}>{tournament.tournamentName}</Button>
            );

        return (
            <div>
                <Button onClick={this.turnOnCreateMode}>Create New Tournament</Button>
                <Button onClick={this.fetchTournaments}>Fetch existing tournaments</Button>
                {this.state.createMode ?
                    <Form>
                        <Form.Field>
                            <label>Tournament's name</label>
                            <input placeholder='name' value={this.state.tournamentName} onChange={this.tournamentNameChanged}/>
                        </Form.Field>
                        <Form.Field>
                            <Form.Select
                                fluid
                                label='League'
                                options={options}
                                placeholder='League'
                                onChange={this.selectedLeagueChanged}
                            />
                        </Form.Field>
                        <div>Add Users</div>
                        <br/>
                        <Form>
                            <Form.Field>
                                <label>Username</label>
                                <input placeholder='name' value={this.state.username}
                                       onChange={this.usernameChanged}/>
                            </Form.Field>
                            <Form.Field>
                                <label>Initial score</label>
                                <input placeholder='score' value={this.state.totalScore}
                                       onChange={this.totalScoreChanged}/>
                            </Form.Field>
                            <Button type='submit' onClick={this.addUser}>Add User</Button>
                        </Form>
                        <Button type='submit' onClick={this.createTournament}>Create Tournament</Button>
                    </Form>
                    : null}
                {this.state.showTournament ?
                    <Tournament tournamentName={this.state.tournamentName} tournamentLeagueId={this.state.tournamentLeagueId}
                        users={this.state.tournamentUsers} tournamentId={this.state.tournamentId} lastRecordedRound={this.state.lastRecordedRound}/>
                : tournamentsList}


            </div>
        );
    }
}

export default Landing;
