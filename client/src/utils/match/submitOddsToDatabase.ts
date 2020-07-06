import axiosInstance from "../../axios";

export const submitOdds = (matchId: any, homeOdd: any, tieOdd: any, awayOdd: any, tournamentId: string, oddsSource: string) => {
        const homeOddObj = {value: +homeOdd, tournamentId: tournamentId, source: oddsSource};
        const tieOddObj = {value: +tieOdd, tournamentId: tournamentId, source: oddsSource};
        const awayOddObj = {value: +awayOdd, tournamentId: tournamentId, source: oddsSource};
       // console.log(homeOdd);
        //console.log(homeOddObj);

        axiosInstance().put('/matches/' + matchId + '/odds', {
            homeOdd: homeOddObj,
            tieOdd: tieOddObj,
            awayOdd: awayOddObj
        })
            .then(response => {
              //  console.log(response);
            })
            .catch(err => {
                console.log(err)
            });
    };
