import {MatchType, User} from "../constants/interfaces";

export const  addMissingToTotal = (matchesToHandle: any, stateUsers: any) => {
    let unhandledMatches: MatchType [] = [...matchesToHandle];
    console.log(unhandledMatches);
    //console.log(unhandledMatches[0].goalsHomeTeam);
    let users: User [] = [...stateUsers];
    console.log(unhandledMatches);
    for (let m = 0; m < users.length; m++) {
        for (let k = 0; k < unhandledMatches.length; k++) {
            if (unhandledMatches[k].goalsHomeTeam > unhandledMatches[k].goalsAwayTeam) {
                console.log('the result is home win with odd: ' + unhandledMatches[k].homeOdd);
                // @ts-ignore
                if (unhandledMatches[k].homeWinUsers.indexOf(users[m].name) > -1) {
                    console.log('Add  ' + unhandledMatches[k].homeOdd + ' to ' + users[m].name);
                    // @ts-ignore
                    users[m].totalScore = +parseFloat((users[m].totalScore + unhandledMatches[k].homeOdd).toFixed(2));

                }
            } else if (unhandledMatches[k].goalsHomeTeam < unhandledMatches[k].goalsAwayTeam) {
                console.log('the result is away win with odd: ' + unhandledMatches[k].awayOdd);
                // @ts-ignore
                if (unhandledMatches[k].awayWinUsers.indexOf(users[m].name) > -1) {
                    console.log('Add  ' + unhandledMatches[k].awayOdd + ' to ' + users[m].name);
                    users[m].totalScore = +parseFloat((users[m].totalScore + unhandledMatches[k].awayOdd).toFixed(2));
                }
            } else if (unhandledMatches[k].goalsHomeTeam === unhandledMatches[k].goalsAwayTeam) {
                console.log('the result is a tie with odd: ' + unhandledMatches[k].tieOdd);
                // @ts-ignore
                if (unhandledMatches[k].tieUsers.indexOf(users[m].name) > -1) {
                    console.log('Add  ' + unhandledMatches[k].tieOdd + ' to ' + users[m].name);
                    users[m].totalScore = +parseFloat((users[m].totalScore + unhandledMatches[k].tieOdd).toFixed(2));
                }
            }
        }
    }
    console.log(users);
    return users;
    //this.updateUsersScore(users);
    //this.setState({unhandledMatches: []});
};
