import axios from "axios";
import {headers} from "../constants/objects";

export const  verifyLastRoundHasEnded = async (fixtures: any, currentRound: string, leagueId: number) => {
    console.log(fixtures);
    let roundHasEnded = true;
    let desiredPrevRound = getDesiredPrevRound(currentRound);
    let firstNewMatch = getClosestNewRoundMatch(fixtures);
    let lastFixtures =  null;
    console.log(desiredPrevRound);
    console.log(firstNewMatch);
    //  console.log(this.state.leagueCurrentRound);
    console.log('currRoundMatches');
    //console.log(this.state.leagueCurrentRound);
   await axios.get('https://api-football-v1.p.rapidapi.com/v2/fixtures/league/' + leagueId + '/' + desiredPrevRound, {headers})
        .then(async response => {
            lastFixtures = response.data.api.fixtures;
            console.log(lastFixtures);
            for (let i = 0; i < lastFixtures.length; i++) {
                if (lastFixtures[i].statusShort !== 'FT') {
                    if (lastFixtures[i].event_date.localeCompare(firstNewMatch) === -1) {
                        console.log('Round not ended! ' + lastFixtures[i]);
                        roundHasEnded = false;
                        break;
                    }
                }
            }
        })
        .catch(error => {console.log(error)})
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

const getDesiredPrevRound = (currentRound: string) => {
    //let currentPrevRound = this.state.desiredPrevRound;
    let currentPrevRound = currentRound;
    let currentPrevRoundNumber = '';
    let newPrevRoundNumber = '';
    let firstNumberIndex = -1;
    for (let i = 0; i < currentPrevRound.length; i++) {

        if (currentPrevRound.charAt(i) >= '0' && currentPrevRound.charAt(i) <= '9') {
            if (firstNumberIndex < 0) {
                firstNumberIndex = i;
            } else {
            }
            console.log(currentPrevRound.charAt(i));
            currentPrevRoundNumber = currentPrevRoundNumber + currentPrevRound.charAt(i);
            console.log(currentPrevRoundNumber);
        }
    }
    newPrevRoundNumber = +(currentPrevRoundNumber) - 1 + '';
    console.log(newPrevRoundNumber);
    const newDesiredPrevRound = currentRound.substring(0, firstNumberIndex) + newPrevRoundNumber;
    console.log(newDesiredPrevRound);
    //this.setState({desiredPrevRound: newDesiredPrevRound});
    return newDesiredPrevRound;
};
