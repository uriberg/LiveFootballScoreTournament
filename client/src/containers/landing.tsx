import React, {Component} from 'react';
import {Button, Card, Image, Icon} from "semantic-ui-react";
import Tournament from "./tournament";
import classes from './landing.module.css';
import {Link, Element} from 'react-scroll'
import Spinner from '../components/UI/Spinner';
import {connect} from 'react-redux';
import * as actions from '../store/actions/index';
import CreateTournamentForm from '../components/createTournamentForm';
import {User} from "../constants/interfaces";

interface PropsFromDispatch {
    onFetchTournaments: () => void,
    onCreateTournament: (newTournament: any) => void,
    onGetTournament: (id: string) => void
}

interface PropsFromState {
    tournamentsArray: [],
    tournamentId: string,
    lastRecordedRound: string,
    selectedTournamentName: string,
    selectedTournamentLeagueId: number,
    selectedTournamentUsers: User [],
    selectedTournamentOddsSource: string
}

type AllProps = PropsFromState
    & PropsFromDispatch;

class Landing extends Component<AllProps> {

    state = {
        createMode: false,
        showTournament: false,
        fetchMode: false,
        loading: false,
        username: '',
        totalScore: 0,
        tournamentName: '',
        tournamentLeagueId: 637,
        tournamentOddsSource: '',
        tournamentUsers: [],
    };

    turnOnCreateMode = async () => {
        this.setState({createMode: true, fetchMode: false, tournamentUsers: [], tournamentName: ''});
    };

    createTournament = async () => {
        this.setState({loading: true});
        const newTournament = {
            tournamentName: this.state.tournamentName,
            tournamentLeagueId: this.state.tournamentLeagueId,
            tournamentUsers: this.state.tournamentUsers,
            tournamentOddsSource: this.state.tournamentOddsSource
        };

        await this.props.onCreateTournament(newTournament);
        this.setState({createMode: false, showTournament: true});
        setTimeout(() => {
            this.setState({loading: false});
            var elmnt = document.getElementById("shownTournament");
            if (elmnt) {
                elmnt.scrollIntoView();
            }
        }, 3000);
    };

    fetchTournaments = async () => {
        await this.props.onFetchTournaments();
        this.setState({fetchMode: true, createMode: false});
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

    //combine someway with landing addUser??
    addUser = () => {
        const newUser = {
            name: this.state.username,
            totalScore: this.state.totalScore,
            weeklyScore: 0
        };

        const tournamentUsersArray: any[] = [...this.state.tournamentUsers];
        tournamentUsersArray.push(newUser);

        this.setState({tournamentUsers: tournamentUsersArray, username: '', totalScore: 0});
    };

    selectedLeagueChanged = (event: any, {value}: any) => {
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

    getTournament = async (id: string) => {
        this.setState({showTournament: false});
        await this.props.onGetTournament(id);
        this.setState({showTournament: true});
    };

    render() {
        const tournamentsList = this.props.tournamentsArray.map((tournament: any) =>
            <div className={classes.cardItem} key={tournament._id}>
                <Link activeClass="active" to="test2" spy={true} smooth="easeInOutQuart"
                      offset={0}
                      duration={800}
                      onClick={() => this.getTournament(tournament._id)}>
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
                            <CreateTournamentForm tournamentName={this.state.tournamentName}
                                                  username={this.state.username} totalScore={this.state.totalScore}
                                                  handleTournamentNameChange={this.tournamentNameChanged}
                                                  handleUsernameChanged={this.usernameChanged}
                                                  handleTotalScoreChange={this.totalScoreChanged}
                                                  handleSelectedLeagueChanged={this.selectedLeagueChanged}
                                                  handleSelectedOddsSourceChange={this.selectedOddsSourceChanged}
                                                  handleAddUser={this.addUser}
                                                  handleTournamentCreate={this.createTournament}/>
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
                                <Tournament tournamentName={this.props.selectedTournamentName}
                                            tournamentLeagueId={this.props.selectedTournamentLeagueId}
                                            tournamentId={this.props.tournamentId}
                                            lastRecordedRound={this.props.lastRecordedRound}
                                            oddsSource={this.props.selectedTournamentOddsSource}
                                            backHome={this.backToHomePage}
                                            initialUsers={this.props.selectedTournamentUsers}/>
                            </div> : null}
                    </Element>
                </div>
        );
    }
}

const mapStateToProps = (state: any) => {
    return {
        tournamentsArray: state.landing.tournamentsArray,
        tournamentId: state.landing.tournamentId,
        lastRecordedRound: state.landing.lastRecordedRound,
        selectedTournamentName: state.landing.selectedTournamentName,
        selectedTournamentLeagueId: state.landing.selectedTournamentLeagueId,
        selectedTournamentUsers: state.landing.selectedTournamentUsers,
        selectedTournamentOddsSource: state.landing.selectedTournamentOddsSource
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        onFetchTournaments: () => dispatch(actions.fetchTournaments()),
        onCreateTournament: (newTournament: any) => dispatch(actions.createTournament(newTournament)),
        onGetTournament: (id: string) => dispatch(actions.getTournament(id))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Landing);
