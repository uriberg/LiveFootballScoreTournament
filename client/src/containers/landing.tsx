import React, {Component} from 'react';
import axiosInstance from '../axios';
import {Button, Form, Card, Image, Icon} from "semantic-ui-react";
import Tournament from "./tournament";
import classes from './landing.module.css';
import {Link, Element} from 'react-scroll'
import Spinner from '../components/UI/Spinner';

const options = [
    {key: 'il', text: 'Israeli Premier League', value: 'Israeli Premier League', flag: 'il'},
    {key: 'gb eng', text: 'Premier League', value: 'Premier League', flag: 'gb eng'},
    {key: 'es', text: 'La Liga', value: 'La Liga', flag: 'es'},
    {key: 'it', text: 'Serie A', value: 'Serie A', flag: 'it'},
    {key: 'de', text: 'Bundesliga', value: 'Bundesliga', flag: 'de'},
    {key: 'fr', text: 'Ligue 1', value: 'Ligue 1', flag: 'fr'}
];

const oddsFetchingOptions = [
    {key: '365', text: 'Bet365', value: 'Bet365'},
    {key: 'Bwin', text: 'Bwin', value: 'Bwin'},
    {key: 'manual', text: 'Manual', value: 'Manual'}
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
        fetchMode: false,
        tournamentOddsSource: '',
        loading: false
    };

    turnOnCreateMode = () => {
        this.setState({createMode: true, fetchMode: false, tournamentUsers: [], tournamentName: ''});
    };

    createTournament = () => {
        this.setState({loading: true});
        console.log('tournamentName: ', this.state.tournamentName);
        console.log('leagueId: ', this.state.tournamentLeagueId);
        console.log('tournamentUsers: ', this.state.tournamentUsers);
        const newTournament = {
            tournamentName: this.state.tournamentName,
            tournamentLeagueId: this.state.tournamentLeagueId,
            tournamentUsers: this.state.tournamentUsers,
            tournamentOddsSource: this.state.tournamentOddsSource
        };
        axiosInstance().post('/tournaments/newTournament', {newTournament})
            .then((response: any) => {
                console.log(response);
                this.setState({createMode: false, tournamentId: response.data._id, showTournament: true});
                setTimeout(() => {
                    //this.getTournament(response.data._id);
                    // scroll.scrollTo(window.innerHeight);
                    var elmnt = document.getElementById("shownTournament");
                    if (elmnt) {
                        elmnt.scrollIntoView();

                    }
                    this.setState({loading: false});
                }, 2000);
            })
            .catch((err: any) => {
                console.log(err)
            });
    };

    fetchTournaments = () => {
        axiosInstance().get('/tournaments')
            .then(response => {
                console.log(response);
                this.setState({tournamentsArray: response.data, fetchMode: true, createMode: false});
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
        console.log(value);
        this.setState({totalScore: value});
    };

    addUser = () => {
        console.log(this.state.totalScore);
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
        if (value === 'Israeli Premier League') {
            this.setState({tournamentLeagueId: 637});
        } else if (value === 'Premier League') {
            this.setState({tournamentLeagueId: 524});
        } else if (value === 'La Liga') {
            this.setState({tournamentLeagueId: 775});
        } else if (value === 'Serie A') {
            this.setState({tournamentLeagueId: 891});
        } else if (value === 'Bundesliga') {
            this.setState({tournamentLeagueId: 754});
        } else if (value === 'Ligue 1') {
            this.setState({tournamentLeagueId: 525});
        }
    };

    selectedOddsSourceChanged = (event: any, {value}: any) => {
        console.log(value);
        if (value === 'Bet365') {
            this.setState({tournamentOddsSource: 'Bet365'});
        } else if (value === 'Bwin') {
            this.setState({tournamentOddsSource: 'Bwin'});
        } else if (value === 'Manual') {
            this.setState({tournamentOddsSource: 'Manual'});
        }
    };

    backToHomePage = () => {
        this.setState({showTournament: false, fetchMode: false, createMode: false});
    };

    getTournament = (id: string) => {
        this.setState({showTournament: false});
        axiosInstance().get('/tournaments/' + id)
            .then(response => {
                console.log(response);
                this.setState({
                    tournamentName: response.data.tournamentName,
                    tournamentLeagueId: response.data.tournamentLeagueId,
                    tournamentUsers: response.data.tournamentUsers,
                    tournamentId: id,
                    lastRecordedRound: response.data.lastRecordedRound,
                    tournamentOddsSource: response.data.tournamentOddsSource,
                    showTournament: true
                });
                console.log(response.data);
            })
            .catch(err => {
                console.log(err)
            });
        //console.log(event.target._id);
    };

    render() {
        const tournamentsList = this.state.tournamentsArray.map((tournament: any) =>
            <div className={classes.cardItem}>
                <Link activeClass="active" to="test2" spy={true} smooth="easeInOutQuart"
                      offset={0}
                      duration={800}
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
            this.state.loading ? <div className={classes.loadingWrapper}><Spinner/></div> :
                <div className={classes.container}>

                    <div className={classes.mainButtons}>
                        <Link activeClass="active" to="test1" spy={true} smooth="easeInOutQuart"
                              offset={0}
                              duration={800}>
                            <Button onClick={this.fetchTournaments}>Fetch existing tournaments</Button>
                        </Link>

                        <Link activeClass="active" to="createForm" spy={true} smooth="easeInOutQuart"
                              offset={0}
                              duration={800}>
                            <Button onClick={this.turnOnCreateMode}>Create New Tournament</Button>
                        </Link>

                    </div>
                    <Element name="createForm" className="element">
                        {this.state.createMode ?
                            <Form className={classes.createFormStyle}>
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
                                <Form.Field>
                                    <Form.Select
                                        fluid
                                        label='Odds source'
                                        options={oddsFetchingOptions}
                                        placeholder='Source'
                                        onChange={this.selectedOddsSourceChanged}
                                    />
                                </Form.Field>
                                <div className={classes.addUsersTitle}>Add Users</div>
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
                                <div className={classes.createTournamentButton}>
                                    <Link activeClass="active" to="test2" spy={true} smooth="easeInOutQuart"
                                          offset={0}
                                          duration={800}>
                                        <Button type='submit' onClick={this.createTournament} style={{width: '100%'}}>Create
                                            Tournament</Button>
                                    </Link>
                                </div>
                            </Form>
                            : null}
                    </Element>
                    <Element name="test1" className="element">
                        {this.state.fetchMode ?
                            <div className={classes.cardsWrapper}>
                                <div className="ui grid" style={{margin: '0 5%'}}>
                                    {tournamentsList}
                                </div>
                            </div>
                            : null}
                    </Element>


                    <Element name="test2" className="element" id="shownTournament">
                        {this.state.showTournament ?
                            <div className={classes.showTournament}>
                                <Tournament tournamentName={this.state.tournamentName}
                                            tournamentLeagueId={this.state.tournamentLeagueId}
                                            users={this.state.tournamentUsers} tournamentId={this.state.tournamentId}
                                            lastRecordedRound={this.state.lastRecordedRound}
                                            oddsSource={this.state.tournamentOddsSource}
                                            backHome={this.backToHomePage}/>
                            </div> : null}
                    </Element>


                </div>
        );
    }
}

export default Landing;
