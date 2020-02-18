import {MatchType, User} from "../constants/interfaces";

export const calculateWeeklyScore = (stateUsers: any, stateCurrMatches: any, tournamentId: string) => {
    let users: User [] = [...stateUsers];
    let matches: MatchType [] = [...stateCurrMatches];
    console.log(matches);
    for (let i = 0; i < users.length; i++) {
        users[i].weeklyScore = 0;

        for (let j = 0; j < matches.length; j++) {
            if (matches[j].goalsHomeTeam !== null) {
                let homeOddIndex = matches[j].homeOdd.findIndex((item: any) => item.tournamentId === tournamentId);
                let tieOddIndex = matches[j].tieOdd.findIndex((item: any) => item.tournamentId === tournamentId);
                let awayOddIndex = matches[j].awayOdd.findIndex((item: any) => item.tournamentId === tournamentId);
                if (homeOddIndex > -1 && tieOddIndex > -1 && awayOddIndex > -1) {//i.e odds have been submitted
                    if (matches[j].goalsHomeTeam > matches[j].goalsAwayTeam) {
                        // @ts-ignore
                        if (matches[j].homeWinUsers.findIndex((item: any) => item.name === users[i].name && item.tournamentId === tournamentId) > -1) {
                            users[i].weeklyScore = +parseFloat((users[i].weeklyScore + matches[j].homeOdd[homeOddIndex].value).toFixed(2));
                        }
                    } else if (matches[j].goalsHomeTeam < matches[j].goalsAwayTeam) {
                        // @ts-ignore
                        if (matches[j].awayWinUsers.findIndex((item: any) => item.name === users[i].name && item.tournamentId === tournamentId) > -1) {
                            users[i].weeklyScore = +parseFloat((users[i].weeklyScore + matches[j].awayOdd[awayOddIndex].value).toFixed(2));
                        }
                    } else if (matches[j].goalsHomeTeam === matches[j].goalsAwayTeam) {
                        // @ts-ignore
                        if (matches[j].tieUsers.findIndex((item: any) => item.name === users[i].name && item.tournamentId === tournamentId) > -1) {
                            users[i].weeklyScore = +parseFloat((users[i].weeklyScore + matches[j].tieOdd[tieOddIndex].value).toFixed(2));
                        }
                    }
                }
            }
        }
    }
    // if (users.length > 0) {
    //     return users;
    // }
    console.log(users);
    return users;
};
