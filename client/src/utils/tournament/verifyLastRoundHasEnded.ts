import axios from "axios";
import {headers} from "../../constants/objects";
import {DEBUG} from "../../constants/settings";

export const  verifyLastRoundHasEnded = async (fixtures: any, currentRound: string, leagueId: number) => {
  //  DEBUG && console.log(fixtures);
    let roundHasEnded = true;
    let desiredPrevRound = getDesiredPrevRound(currentRound);
    let firstNewMatch = getClosestNewRoundMatch(fixtures);
    let lastFixtures =  null;
    //DEBUG && console.log(desiredPrevRound);
    //DEBUG && console.log(firstNewMatch);
    //  DEBUG && console.log(this.state.leagueCurrentRound);
    //DEBUG && console.log('currRoundMatches');
    //DEBUG && console.log(this.state.leagueCurrentRound);
   await axios.get('https://api-football-v1.p.rapidapi.com/v2/fixtures/league/' + leagueId + '/' + desiredPrevRound, {headers})
        .then(async response => {
            lastFixtures = response.data.api.fixtures;
            //DEBUG && console.log(lastFixtures);
            for (let i = 0; i < lastFixtures.length; i++) {
                if (lastFixtures[i].statusShort !== 'FT') {
                    if (lastFixtures[i].event_date.localeCompare(firstNewMatch) === -1) {
                       // DEBUG && console.log('Round not ended! ' + lastFixtures[i]);
                        roundHasEnded = false;
                        break;
                    }
                }
            }
        })
        .catch(error => {DEBUG && console.log(error)});
    if (roundHasEnded){
        return fixtures;
    } else {
        return lastFixtures;
    }
};

const getClosestNewRoundMatch = (fixtures: any) =>  {
    let firstEvent = fixtures[0].event_date;
    for (let i = 1; i < fixtures.length; i++) {
        if (firstEvent.localeCompare(fixtures[i].event_date) === 1) {
            firstEvent = fixtures[i].event_date;
        }
    }
    return firstEvent;
};

export const getDesiredPrevRound = (currentRound: string) => {
    //let currentPrevRound = this.state.desiredPrevRound;
    let currentPrevRound = currentRound;
    let currentPrevRoundNumber = '';
    let firstNumberIndex = -1;
    for (let i = 0; i < currentPrevRound.length; i++) {

        if (currentPrevRound.charAt(i) >= '0' && currentPrevRound.charAt(i) <= '9') {
            if (firstNumberIndex < 0) {
                firstNumberIndex = i;
            } else {
            }
           //DEBUG && console.log(currentPrevRound.charAt(i));
            currentPrevRoundNumber = currentPrevRoundNumber + currentPrevRound.charAt(i);
            //DEBUG && console.log(currentPrevRoundNumber);
        }
    }
    const newPrevRoundNumber = +(currentPrevRoundNumber) - 1 + '';
    //DEBUG && console.log(newPrevRoundNumber);
    const newDesiredPrevRound = currentRound.substring(0, firstNumberIndex) + newPrevRoundNumber;
    //DEBUG && console.log(newDesiredPrevRound);
    //this.setState({desiredPrevRound: newDesiredPrevRound});
    return newDesiredPrevRound;
};
