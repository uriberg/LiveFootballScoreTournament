export interface MatchType {
    _id: number;
    homeOdd: any;
    awayOdd: any;
    tieOdd: any;
    homeWinUsers: [];
    awayWinUsers: [];
    tieUsers: [];
    goalsHomeTeam: any;
    goalsAwayTeam: any;
    homeTeamName: string;
    awayTeamName: string;
    round: string;
    leagueId: number;
    statusShort: string;
}

export interface User {
    _id: string;
    nickname: string;
    totalScore: any;
    weeklyScore: number;
}
