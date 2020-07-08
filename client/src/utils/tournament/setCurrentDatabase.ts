import axiosInstance from "../../axios";
import axios from "axios";
import {DEBUG} from "../../constants/settings";

export const setCurrentDatabase = async (currFixtures: any) => {
    let promises = [];
    for (let i = 0; i < currFixtures.length; i++) {

        // @ts-ignore
        let matchId = currFixtures[i].fixture_id;
        // @ts-ignore
        let homeTeamName = currFixtures[i].homeTeam.team_name;
        // @ts-ignore
        let awayTeamName = currFixtures[i].awayTeam.team_name;
        // @ts-ignore
        let currentRound = currFixtures[i].round;
        // DEBUG && console.log(currentRound);
        // @ts-ignore
        let leagueId = currFixtures[i].league_id;

        //this.addMatch(matchId, homeTeamName, awayTeamName, currentRound, leagueId, i);
        promises.push(axiosInstance().post('/matches/add', {
            matchId: matchId,
            homeTeamName: homeTeamName,
            awayTeamName: awayTeamName,
            round: currentRound,
            leagueId: leagueId
        }));
    }
   await axios.all(promises).then(() => {
        DEBUG && console.log('finish all Axios in setCurrent Database');
        //this.setState({allMatchesExists: true});
    })
        .catch(err => {
            DEBUG && console.log(err)
        });
};
