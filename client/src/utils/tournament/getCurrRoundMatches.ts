import axios from "axios";
import {headers} from "../../constants/objects";
import {DEBUG} from "../../constants/settings";

export const getCurrRoundMatches = async (currentRound: string, leagueId: number) => {
    //  DEBUG && console.log(this.state.leagueCurrentRound);
   // DEBUG && console.log('currRoundMatches');
    //DEBUG && console.log(this.state.leagueCurrentRound);
    let curr = '';
    await axios.get('https://api-football-v1.p.rapidapi.com/v2/fixtures/league/' + leagueId + '/' + currentRound, {headers})
        .then(async response => {
            //DEBUG && console.log(response);
            curr =  await response.data.api.fixtures;
            //verifyLastRoundHasEnded(response.data.api.fixtures, currentRound, leagueId);
        })
        .catch(err => DEBUG && console.log(err));
    return curr;
};
