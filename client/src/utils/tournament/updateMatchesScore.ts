import {MatchType} from "../../constants/interfaces";
import axiosInstance from "../../axios";
import axios from "axios";
import {DEBUG} from "../../constants/settings";

export  const updateMatchesScore = (matchesToHandles: any) => {
    let unhandledMatches: MatchType [] = [...matchesToHandles];
    let promises = [];
   // DEBUG && console.log(unhandledMatches);
    for (let i = 0; i < unhandledMatches.length; i++) {
        // @ts-ignore
        let matchId = unhandledMatches[i].fixture_id;
        let goalsHomeTeam = unhandledMatches[i].goalsHomeTeam;
        let goalsAwayTeam = unhandledMatches[i].goalsAwayTeam;
        promises.push(axiosInstance().put('/matches/' + matchId + '/result', {
            goalsHomeTeam: goalsHomeTeam,
            goalsAwayTeam: goalsAwayTeam
        }));
    }
    axios.all(promises).then((results) => {
        DEBUG && console.log('NOW RESULT: ', results);
        DEBUG && console.log(unhandledMatches);
        let manipulatedResults = [];
        for (let i = 0; i < results.length; i++) {
            manipulatedResults.push(results[i].data);
        }
        return manipulatedResults;
        //this.setState({unhandledMatches: manipulatedResults});
        //this.addMissingToTotal();
    });
};
