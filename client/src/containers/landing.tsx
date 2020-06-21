import React, {Component} from 'react';
import {Card, Image, Icon} from "semantic-ui-react";
import Tournament from "./tournament";
import classes from './landing.module.css';
import {Link, Element} from 'react-scroll'
import Spinner from '../components/UI/Spinner';
import {connect} from 'react-redux';
import * as actions from '../store/actions/index';
import CreateTournamentForm from '../components/createTournamentForm';
import {User} from "../constants/interfaces";
import Button from "../components/button";
import SocialButton from '../components/socialButton';
import {FacebookLoginButton, GoogleLoginButton} from 'react-social-login-buttons';
import JoinTournamentForm from "../components/joinTournamentForm";

const Fade = require('react-reveal/Fade');
const Zoom = require('react-reveal/Zoom');

interface PropsFromDispatch {
    onFetchTournaments: (userId: string) => void,
    onCreateTournament: (newTournament: any, userId: string, nickname: string) => void,
    onJoinToTournament: (tournamentSerialNumber: any, joinedUser: any) => void,
    onGetTournament: (id: string, currUserId: any) => void,
    onClearStore: () => void,
    onLogin: (name: string, id: number) => void,
    onLogout: () => void
}

interface PropsFromState {
    tournamentsArray: [],
    tournamentId: string,
    lastRecordedRound: string,
    selectedTournamentName: string,
    selectedTournamentLeagueId: number,
    selectedTournamentUsers: User [],
    selectedTournamentOddsSource: string,
    currUserName: string,
    currUserId: string,
    isTournamentAdmin: boolean,
    userNicknames: []
}

type AllProps = PropsFromState
    & PropsFromDispatch;

class Landing extends Component<AllProps> {

    state = {
        createMode: false,
        showTournament: false,
        fetchMode: false,
        loading: false,
        nickname: '',
        totalScore: 0,
        tournamentName: '',
        tournamentLeagueId: 637,
        tournamentOddsSource: '',
        tournamentUsers: [],
        tournamentSerialNumber: '',
        joinMode: false,
        logged: false,
        user: {},
        currentProvider: ''
    };

    nodes = {};

    turnOnCreateMode = async () => {
        this.setState({createMode: true, fetchMode: false, joinMode: false, tournamentUsers: [], tournamentName: ''});
    };

    createTournament = async () => {
        this.setState({loading: true});
        console.log(this.state.tournamentLeagueId);
        let tournamentCreator = {
            _id: this.props.currUserId,
            nickname: this.state.nickname,
            totalScore: 0,
            weeklyScore: 0
        };

        let tournamentUsers = [];
        tournamentUsers.push(tournamentCreator);

        const newTournament = {
            tournamentName: this.state.tournamentName,
            tournamentLeagueId: this.state.tournamentLeagueId,
            tournamentUsers: tournamentUsers,
            tournamentOddsSource: this.state.tournamentOddsSource,
            nickname: this.state.nickname,
            tournamentCreator: this.props.currUserId
        };

        await this.props.onCreateTournament(newTournament, this.props.currUserId, this.state.nickname);
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
        this.setState({fetchMode: true, createMode: false, joinMode: false, nickname: ''});
        await this.props.onFetchTournaments(this.props.currUserId);
        console.log(this.props.tournamentsArray);
    };

    tournamentNameChanged = ({currentTarget: {value}}: React.SyntheticEvent<HTMLInputElement>) => {
        this.setState({tournamentName: value});
    };

    nicknameChanged = ({currentTarget: {value}}: React.SyntheticEvent<HTMLInputElement>) => {
        this.setState({nickname: value});
    };

    totalScoreChanged = ({currentTarget: {value}}: React.SyntheticEvent<HTMLInputElement>) => {
        this.setState({totalScore: value});
    };

    tournamentSerialChanged = ({currentTarget: {value}}: React.SyntheticEvent<HTMLInputElement>) => {
        this.setState({tournamentSerialNumber: value});
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
        } else if (value === 'Belarus Premier League') {
            this.setState({tournamentLeagueId: 1383});
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
        this.props.onClearStore();
    };

    getTournament = async (id: string) => {
        this.setState({showTournament: false});
        console.log(id);
        await this.props.onGetTournament(id, this.props.currUserId);
        let nickname = '';
        console.log(this.props.currUserId);
        for (let i = 0; i < this.props.userNicknames.length; i++) {
            console.log(this.props.userNicknames[i]);
            // @ts-ignore
            if (this.props.userNicknames[i]._id === id) {
                // @ts-ignore
                nickname = this.props.userNicknames[i].nickname;
                break;
            }
        }
        console.log(this.state.nickname);
        this.setState({showTournament: true, nickname: nickname});
    };

    handleSocialLogin = (user: any) => {
        console.log(user.profile.name);
        console.log(user.profile.id);

        this.setState({
            logged: true,
            currentProvider: user._provider,
            user
        });
        this.props.onLogin(user.profile.name, user.profile.id);
    };

    handleSocialLoginFailure = (err: any) => {
        console.error(err);
    };

    onLogoutSuccess = () => {
        this.setState({
            logged: false,
            currentProvider: '',
            user: {}
        });
    };

    onLogoutFailure = (err: any) => {
        console.error(err);
    };

    logout = () => {
        const {logged, currentProvider} = this.state;
        console.log(this.nodes);

        if (logged && currentProvider) {
            (this.nodes as any)[currentProvider].props.triggerLogout();
            this.props.onLogout();
        }
    };

    setNodeRef(provider: any, node: any) {
        console.log(node);
        console.log(provider);
        if (node) {
            console.log(node);
            console.log(this.nodes);
            (this.nodes as any)[provider] = node;
        }
    };

    turnOnJoinMode = () => {
        this.setState({createMode: false, fetchMode: false, joinMode: true, tournamentUsers: [], tournamentName: ''});
    };

    joinTournament = async () => {
        let validToJoin = true;
        await this.props.onFetchTournaments(this.props.currUserId);
        for (let i = 0; i < this.props.tournamentsArray.length; i++) {
            // @ts-ignore
            if (this.props.tournamentsArray[i]._id === this.state.tournamentSerialNumber) {
                validToJoin = false;
                console.log('You are already part of this tournament');
                alert('you are already part of this tournament');
                break;
            }
        }

        await this.props.onGetTournament(this.state.tournamentSerialNumber, this.props.currUserId);
        for (let i = 0; i < this.props.selectedTournamentUsers.length; i++) {
            if (this.props.selectedTournamentUsers[i].nickname === this.state.nickname) {
                validToJoin = false;
                alert('nickname is occupied');
                console.log('nickname is occupied');
                break;
            }
        }

        if (validToJoin) {
            this.setState({loading: true});
            console.log(this.state.tournamentSerialNumber);
            let joinedUser = {
                _id: this.props.currUserId,
                nickname: this.state.nickname,
                totalScore: 0,
                weeklyScore: 0
            };


            await this.props.onJoinToTournament(this.state.tournamentSerialNumber, joinedUser);
            this.setState({joinMode: false, showTournament: true});
            setTimeout(() => {
                this.setState({loading: false});
                var elmnt = document.getElementById("shownTournament");
                if (elmnt) {
                    elmnt.scrollIntoView();
                }
            }, 3000);
        }
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
                <Zoom>
                    <div className={classes.container}>
                        <div className={classes.mainButtons}>
                            {this.state.logged ?
                                <Link activeClass="active" to="test1" spy={true} smooth="easeInOutQuart"
                                      offset={0}
                                      duration={800}
                                      className={[classes.link, classes.btnMarginSmall].join(' ')}>
                                    <Button onHandleClick={this.fetchTournaments} name={"Fetch existing tournaments"}/>
                                </Link> : null}

                            {!this.state.logged ? <div>
                                    <SocialButton
                                        provider='facebook'
                                        appId='2689386027831977'
                                        onLoginSuccess={this.handleSocialLogin}
                                        onLoginFailure={this.handleSocialLoginFailure}
                                        getInstance={this.setNodeRef.bind(this, 'facebook')}
                                        onLogoutFailure={this.onLogoutFailure}
                                        onLogoutSuccess={this.onLogoutSuccess}
                                        autoLogin={true}
                                    >
                                        <FacebookLoginButton className={classes.loginButton}/>
                                    </SocialButton>

                                    <SocialButton
                                        provider='google'
                                        appId='734310093470-6q1lsdl5epaefrqgt9mq6nrkvjth44ke.apps.googleusercontent.com'
                                        onLoginSuccess={this.handleSocialLogin}
                                        onLoginFailure={this.handleSocialLoginFailure}
                                        getInstance={this.setNodeRef.bind(this, 'google')}
                                        onLogoutFailure={this.onLogoutFailure}
                                        onLogoutSuccess={this.onLogoutSuccess}
                                        autoLogin={true}
                                    >
                                        <GoogleLoginButton className={classes.loginButton}/>
                                    </SocialButton>
                                </div> :
                                <a className={[classes.link, classes.btnMarginSmall].join(' ')}>
                                    <Button onHandleClick={this.logout}
                                            name={`Logout from ${this.state.currentProvider}`}/>
                                </a>}

                            {this.state.logged ?
                                <Link activeClass="active" to="createForm" spy={true} smooth="easeInOutQuart"
                                      offset={0}
                                      duration={800}
                                      className={[classes.link, classes.btnMarginSmall].join(' ')}>
                                    <Button onHandleClick={this.turnOnCreateMode} name={"Create New Tournament"}/>
                                </Link> : null}

                            {this.state.logged ?
                                <Link activeClass="active" to="joinForm" spy={true} smooth="easeInOutQuart"
                                      offset={0}
                                      duration={800}
                                      className={[classes.link, classes.btnMarginSmall].join(' ')}>
                                    <Button onHandleClick={this.turnOnJoinMode} name={"Join a Tournament"}/>
                                </Link> : null}

                        </div>
                        <Element name="createForm">
                            {this.state.createMode ?
                                <div className={classes.createForm}>
                                    <CreateTournamentForm tournamentName={this.state.tournamentName}
                                                          nickname={this.state.nickname}
                                                          totalScore={this.state.totalScore}
                                                          handleTournamentNameChange={this.tournamentNameChanged}
                                                          handleNicknameChanged={this.nicknameChanged}
                                                          handleTotalScoreChange={this.totalScoreChanged}
                                                          handleSelectedLeagueChanged={this.selectedLeagueChanged}
                                                          handleSelectedOddsSourceChange={this.selectedOddsSourceChanged}
                                                          handleTournamentCreate={this.createTournament}/>
                                </div>
                                : null}
                        </Element>

                        <Element name="joinForm">
                            {this.state.joinMode ?
                                <div className={classes.joinForm}>
                                    <JoinTournamentForm
                                        nickname={this.state.nickname}
                                        tournamentSerialNumber={this.state.tournamentSerialNumber}
                                        handleTournamentSerialChange={this.tournamentSerialChanged}
                                        handleNicknameChanged={this.nicknameChanged}
                                        handleJoinToTournament={this.joinTournament}/>
                                </div>
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
                                                initialUsers={this.props.selectedTournamentUsers}
                                                admin={this.props.isTournamentAdmin}
                                                currUserNickname={this.state.nickname}/>
                                </div> : null}
                        </Element>
                    </div>
                </Zoom>
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
        selectedTournamentOddsSource: state.landing.selectedTournamentOddsSource,
        currUserName: state.user.currUserName,
        currUserId: state.user.currUserId,
        isTournamentAdmin: state.landing.isTournamentAdmin,
        userNicknames: state.landing.userNicknames
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        onFetchTournaments: (userId: string) => dispatch(actions.fetchTournaments(userId)),
        onCreateTournament: (newTournament: any, userId: string, nickname: string) => dispatch(actions.createTournament(newTournament, userId, nickname)),
        onJoinToTournament: (tournamentSerialNumber: any, joinedUser: any) => dispatch(actions.joinTournament(tournamentSerialNumber, joinedUser)),
        onGetTournament: (id: string, currUserId: any) => dispatch(actions.getTournament(id, currUserId)),
        onClearStore: () => dispatch(actions.clearStore()),
        onLogin: (name: string, id: number) => dispatch(actions.login(name, id)),
        onLogout: () => dispatch(actions.logout())
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Landing);
