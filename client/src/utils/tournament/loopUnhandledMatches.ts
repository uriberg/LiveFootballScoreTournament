import axios from "axios";
import {headers} from "../../constants/objects";

export const loopUnhandledMatches = (unhandledMatches: any) => {
    console.log(unhandledMatches);
    let promises = [];
    for (let i = 0; i < unhandledMatches.length; i++) {
        // @ts-ignore
        let matchId = unhandledMatches[i]._id;
        promises.push(axios.get('https://api-football-v1.p.rapidapi.com/v2/fixtures/id/' + matchId, {headers}));
    }

    axios.all(promises).then((results) => {
        console.log('NOW RESULT: ', results);
        console.log(unhandledMatches);
        let manipulatedResults = [];
        for (let i = 0; i < results.length; i++) {
            manipulatedResults.push(results[i].data.api.fixtures[0]);
        }
        return manipulatedResults;
    });
};
