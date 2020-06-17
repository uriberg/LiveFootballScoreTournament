
export const setUserToAwayWin = (tournamentId: any, selectedUser: string, usersChoseHome: any, usersChoseTie: any, usersChoseAway: any) => {
    // @ts-ignore
    let indexAwayWin = usersChoseAway.findIndex((item: any) => item.nickname === selectedUser && item.tournamentId === tournamentId);
    if (indexAwayWin === -1) {
        // @ts-ignore
        let indexTie = usersChoseTie.findIndex((item: any) => item.nickname === selectedUser && item.tournamentId === tournamentId);
        if (indexTie > -1) {
            usersChoseTie.splice(indexTie, 1);
        } else {
            // @ts-ignore
            let indexHomeWin = usersChoseHome.findIndex((item: any) => item.nickname === selectedUser && item.tournamentId === tournamentId);
            if (indexHomeWin > -1) {
                usersChoseHome.splice(indexHomeWin, 1);
            }
        }
        usersChoseAway.push({nickname: selectedUser, tournamentId: tournamentId});
    }
    const answer = {
        homeWinUsers: usersChoseHome,
        awayWinUsers: usersChoseAway,
        tieUsers: usersChoseTie
    };
    return answer;
};
