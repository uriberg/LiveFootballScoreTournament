import axios from "axios";
import {headers} from "../constants/objects";
import {verifyLastRoundHasEnded} from "./verifyLastRoundHasEnded";

export const getCurrRoundMatches = async (currentRound: string, leagueId: number) => {
    //  console.log(this.state.leagueCurrentRound);
    console.log('currRoundMatches');
    //console.log(this.state.leagueCurrentRound);
    let curr = '';
    await axios.get('https://api-football-v1.p.rapidapi.com/v2/fixtures/league/' + leagueId + '/' + currentRound, {headers})
        .then(async response => {
            console.log(response);
            curr =  await response.data.api.fixtures;
            //verifyLastRoundHasEnded(response.data.api.fixtures, currentRound, leagueId);
        })
        .catch(err => console.log(err));
    return curr;
};
