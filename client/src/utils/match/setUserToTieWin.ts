
export const setUserToTieWin = (tournamentId: any, selectedUser: string, usersChoseHome: any, usersChoseTie: any, usersChoseAway: any) => {
    // @ts-ignore
    let indexTieWin = usersChoseTie.findIndex((item: any) => item.name === selectedUser && item.tournamentId === tournamentId);
    if (indexTieWin === -1) {
        // @ts-ignore
        let indexAway = usersChoseAway.findIndex((item: any) => item.name === selectedUser && item.tournamentId === tournamentId);
        if (indexAway > -1) {
            usersChoseAway.splice(indexAway, 1);
        } else {
            // @ts-ignore
            let indexHomeWin = usersChoseHome.findIndex((item: any) => item.name === selectedUser && item.tournamentId === tournamentId);
            if (indexHomeWin > -1) {
                usersChoseHome.splice(indexHomeWin, 1);
            }
        }
        // @ts-ignore
        usersChoseTie.push({name: selectedUser, tournamentId: tournamentId});
    }
    const answer = {
        homeWinUsers: usersChoseHome,
        awayWinUsers: usersChoseAway,
        tieUsers: usersChoseTie
    };
    return answer;
};
