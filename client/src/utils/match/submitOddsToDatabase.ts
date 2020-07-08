import axiosInstance from "../../axios";
import {DEBUG} from "../../constants/settings";

export const submitOdds = (matchId: any, homeOdd: any, tieOdd: any, awayOdd: any, tournamentId: string, oddsSource: string) => {
        const homeOddObj = {value: +homeOdd, tournamentId: tournamentId, source: oddsSource};
        const tieOddObj = {value: +tieOdd, tournamentId: tournamentId, source: oddsSource};
        const awayOddObj = {value: +awayOdd, tournamentId: tournamentId, source: oddsSource};
       // DEBUG && console.log(homeOdd);
        //DEBUG && console.log(homeOddObj);

        axiosInstance().put('/matches/' + matchId + '/odds', {
            homeOdd: homeOddObj,
            tieOdd: tieOddObj,
            awayOdd: awayOddObj
        })
            .then(response => {
              //  DEBUG && console.log(response);
            })
            .catch(err => {
                DEBUG && console.log(err)
            });
    };
