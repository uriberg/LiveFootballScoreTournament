
export const setUserToHomeWin = (tournamentId: any, selectedUser: string, usersChoseHome: any, usersChoseTie: any, usersChoseAway: any) => {
    let indexHomeWin = usersChoseHome.findIndex((item: any) => item.name === selectedUser && item.tournamentId === tournamentId);
    if (indexHomeWin === -1) {
        // @ts-ignore
        let indexTie = usersChoseTie.findIndex((item) => item.name === selectedUser && item.tournamentId === tournamentId);
        if (indexTie > -1) {
            usersChoseTie.splice(indexTie, 1);
        } else {
            // @ts-ignore
            let indexAwayWin = usersChoseAway.findIndex((item) => item.name === selectedUser && item.tournamentId === tournamentId);
            if (indexAwayWin > -1) {
                usersChoseAway.splice(indexAwayWin, 1);
            }
        }
        // @ts-ignore
        usersChoseHome.push({name: selectedUser, tournamentId: tournamentId});
    }
    const answer = {
        homeWinUsers: usersChoseHome,
        awayWinUsers: usersChoseAway,
        tieUsers: usersChoseTie
    };
    return answer;
};
