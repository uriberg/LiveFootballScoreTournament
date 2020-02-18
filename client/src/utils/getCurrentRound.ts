import axios from "axios";
import {headers} from "../constants/objects";
import {getCurrRoundMatches} from './getCurrRoundMatches';

export const getCurrRound = async (leagueId: number) => {
    console.log('in getCurrRound OF UTILS');
    let currentRound = '';
    await axios.get('https://api-football-v1.p.rapidapi.com/v2/fixtures/rounds/' + leagueId + '/current', {headers})
       .then(response => {
            // console.log(response.data.api.fixtures[0]);
            currentRound = response.data.api.fixtures[0];
            //let currentRound = 'Regular_Season_-_22';
            console.log(currentRound);
            //this.setState({leagueCurrentRound: currentRound, desiredPrevRound: currentRound});
            //return currentRound;
            //return await getCurrRoundMatches(currentRound, leagueId);
        })
        .catch(err => console.log(err));
    return currentRound;
};
