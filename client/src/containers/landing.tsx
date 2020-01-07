import React, {Component} from 'react';
import axiosInstance from '../axios';
import {Button, Form, Card, Grid, Image, Icon} from "semantic-ui-react";
import Tournament from "./tournament";
import classes from './landing.module.css';
import * as Scroll from 'react-scroll';
import {Link, Element, Events, animateScroll as scroll, scrollSpy, scroller} from 'react-scroll'

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
        lastRecordedRound: '',
        fetchMode: false
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
            .catch((err: any) => {
                console.log(err)
            });
    };

    fetchTournaments = () => {
        axiosInstance().get('/tournaments')
            .then(response => {
                console.log(response);
                this.setState({tournamentsArray: response.data, fetchMode: true});
            })
            .catch(err => {
                console.log(err)
            });
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
            .catch(err => {
                console.log(err)
            });
        //console.log(event.target._id);
    };

    render() {
        const tournamentsList = this.state.tournamentsArray.map((tournament: any) =>
            <div className="four wide column" style={{cursor: 'pointer'}}>
                <Link activeClass="active" to="test2" spy={true} smooth={true} offset={50} duration={500}
                      key={tournament._id} onClick={() => this.getTournament(tournament._id)}>
                    <Card>
                        <Image
                            src='https://images.unsplash.com/photo-1552667466-07770ae110d0?ixlib=rb-1.2.1&dpr=1&auto=format&fit=crop&w=416&h=312&q=60'
                            wrapped ui={false}/>
                        <Card.Content>
                            <Card.Header style={{textAlign: 'center'}}>{tournament.tournamentName}</Card.Header>
                        </Card.Content>
                        <Card.Content extra>
                            <div>
                                <Icon name='user'/>
                                {tournament.tournamentUsers.length} Participants
                            </div>
                        </Card.Content>
                    </Card>
                </Link>
            </div>
        );

        return (
            <div className={classes.container}>

                <div className={classes.mainButtons}>
                    <Link activeClass="active" to="test1" spy={true} smooth={true} offset={50} duration={500}>
                        <Button onClick={this.fetchTournaments}>Fetch existing tournaments</Button>
                    </Link>

                    <Button onClick={this.turnOnCreateMode}>Create New Tournament</Button>

                </div>
                {this.state.createMode ?
                    <Form>
                        <Form.Field>
                            <label>Tournament's name</label>
                            <input placeholder='name' value={this.state.tournamentName}
                                   onChange={this.tournamentNameChanged}/>
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
                    <Element name="test1" className="element">
                        {this.state.fetchMode ?
                    <div className="ui grid" style={{margin: '0 5%', height: '100vh'}}>
                        {tournamentsList}
                    </div> : null}
                </Element>


                    <Element name="test2" className="element">
                        {this.state.showTournament ?
                        <div className={classes.showTournament}>
                            <Tournament tournamentName={this.state.tournamentName}
                                        tournamentLeagueId={this.state.tournamentLeagueId}
                                        users={this.state.tournamentUsers} tournamentId={this.state.tournamentId}
                                        lastRecordedRound={this.state.lastRecordedRound}/>
                        </div> : null}
                    </Element>


            </div>
        );
    }
}

export default Landing;
