
export const getBookmakersOdds = (bookmakers: any, oddsSource: string) => {
    let matchOdds = {
        homeOdd: '',
        tieOdd: '',
        awayOdd: ''
    };

    for(let i = 0; bookmakers.length; i++){
        //pure util which returns the matchOdds object. after that we simply dispatch an action with it
        if (bookmakers[i].bookmaker_name === oddsSource){
            let bookmakerBets = bookmakers[i].bets;
           // console.log(bookmakerBets);
            for(let j = 0; j < bookmakerBets.length; j++){
                if (bookmakerBets[j].label_name === 'Match Winner'){
                    let matchWinnerOdds = bookmakerBets[j].values;
                   // console.log(matchWinnerOdds);
                    for(let k = 0; k <matchWinnerOdds.length; k++){
                        if (matchWinnerOdds[k].value === 'Home'){
                            matchOdds.homeOdd = matchWinnerOdds[k].odd;
                        } else if(matchWinnerOdds[k].value === 'Draw'){
                            matchOdds.tieOdd = matchWinnerOdds[k].odd;
                        } else if(matchWinnerOdds[k].value === 'Away'){
                            matchOdds.awayOdd = matchWinnerOdds[k].odd;
                        }
                    }
                   // this.setState({homeOdd: matchOdds.homeOdd, tieOdd: matchOdds.tieOdd, awayOdd: matchOdds.awayOdd});
                    break;
                }
            }
            break;
        }
    }
    return matchOdds;
};
