import axios from "axios";
import {headers} from "../../constants/objects";
import {DEBUG} from "../../constants/settings";

export const getCurrRound = async (leagueId: number) => {
  //  DEBUG && console.log('in getCurrRound OF UTILS');
    let currentRound = '';
    await axios.get('https://api-football-v1.p.rapidapi.com/v2/fixtures/rounds/' + leagueId + '/current', {headers})
       .then(response => {
            // DEBUG && console.log(response.data.api.fixtures[0]);
            currentRound = response.data.api.fixtures[0];
            //let currentRound = 'Regular_Season_-_22';
            //DEBUG && console.log(currentRound);
            //this.setState({leagueCurrentRound: currentRound, desiredPrevRound: currentRound});
            //return currentRound;
            //return await getCurrRoundMatches(currentRound, leagueId);
        })
        .catch(err => DEBUG && console.log(err));
    return currentRound;
};
