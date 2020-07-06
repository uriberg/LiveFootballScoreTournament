const router = require('express').Router();
let Matches = require('../models/match.model');

router.route('/').get((req, res) => {
    console.log('got general request');
    Matches.find()
        .then(notes => {
            res.json(notes);
        })
        .catch(err => res.status(400).json('Error ' + err));
});

router.route('/leagueId/:tournamentLeagueId/').get((req, res) => {
    console.log('got request');
    Matches.find()
        .then(notes => {
            console.log('got request');
            console.log(req.params);
            let leagueId = +req.params.tournamentLeagueId;
            let notesToSend = [];
            console.log(leagueId);

            for (let i = 0; i < notes.length; i++) {
                //console.log(notes[i].round);
                if (notes[i].leagueId === leagueId) {
                    // console.log('pushing!!!');
                    notesToSend.push(notes[i]);
                }
            }
            //console.log(notesToSend);
            res.json(notesToSend);

        })
        .catch(err => res.status(400).json('Error ' + err));
    // Matches.find()
    //     .then(notes => {
    //         res.json(notes);
    //     })
    //     .catch(err => res.status(400).json('Error ' + err));
});

router.route('/verify/:leagueId/:round').get((req, res) => {
    Matches.find()
        .then(matches => {
            let leagueId = +req.params.leagueId;
            let falseRound = req.params.round;
            let matchesToSend = [];
            for (let i = 0; i < matches.length; i++) {
                if ((matches[i].leagueId === leagueId && matches[i].round !== falseRound && matches[i].goalsHomeTeam === null) || matches[i].goalsHomeTeam == -1) {
                   // console.log(matches[i]);
                    matchesToSend.push(matches[i]);
                }
            }
            res.json(matchesToSend);
        })
        .catch(err => res.status(400).json('Error ' + err));
});

router.route('/:leagueId/:currentRound').get((req, res) => {
    //console.log('got request');
    Matches.find()
        .then(notes => {
            //console.log(req.params);
            let leagueId = +req.params.leagueId;
            let round = req.params.currentRound;
            let notesToSend = [];
            //console.log(+leagueId);

            for (let i = 0; i < notes.length; i++) {
                //console.log(notes[i].round);
                //console.log(round);
                if (notes[i].round === round && notes[i].leagueId === leagueId) {
                    // console.log('pushing!!!');
                    notesToSend.push(notes[i]);
                }
            }
            //console.log(notesToSend);
            res.json(notesToSend);

        })
        .catch(err => res.status(400).json('Error ' + err));
});

router.route('/:matchId').get((req, res) => {
    // console.log('matchIdRequest');
    Matches.findById(req.params.matchId)
        .then(match => {
            //console.log(match);
            res.json(match);
        })
        .catch(err => res.status(400).json('Error ' + err));
});

router.route('/add').post((req, res) => {
    // console.log(req.body);
const MatchId = req.body.matchId;
    const homeTeamName = req.body.homeTeamName;
    const awayTeamName = req.body.awayTeamName;
    //  console.log(homeTeamName);
    // console.log(awayTeamName);
    const newMatch = new Matches({
        _id: MatchId,
        homeTeamName: homeTeamName,
        awayTeamName: awayTeamName,
        round: req.body.round,
        leagueId: req.body.leagueId,
        statusShort: 'NS',
        goalsHomeTeam: null,
        goalsAwayTeam: null,
        homeOdd: [],
        tieOdd: [],
        awayOdd: []
    });

    newMatch.save()
        .then(() => res.json(newMatch))
        .catch(err => res.status(400).json('Error ' + err));
});

router.route('/newUser').post((req, res) => {
    //console.log(req.body);
    const newMatch = new Matches({
        _id: MatchId,
        homeOdd: null,
        tieOdd: null,
        awayOdd: null
    });

    newMatch.save()
        .then(() => res.json(newMatch))
        .catch(err => res.status(400).json('Error ' + err));
});
//
// router.route('/:id').delete((req, res) => {
//     Note.findByIdAndDelete(req.params.id)
//         .then(res.json('Note Deleted!'))
//         .catch(err => res.status(400).json('Error: ' + err));
// });
//
// router.route('/:id/todoList/add').post((req,res) => {
//     Note.findByIdAndUpdate(req.params.id)
//         .then(note => {
//             note.todoList.push(req.body.todo);
//             note.save();
//             console.log(note);
//             res.json(note);
//         })
//         .catch(err => res.status(400).json('Error ' + err));
// });
//
router.route('/:matchId/odds').put((req, res) => {
   // console.log(req.body);
    Matches.findByIdAndUpdate(req.params.matchId)
        .then(match => {
            let index = match.homeOdd.findIndex(item => item.tournamentId === req.body.homeOdd.tournamentId);
          //  console.log('The index is: ' + index);
            if (index > -1){
                match.homeOdd.splice(index, 1);
                match.tieOdd.splice(index, 1);
                match.awayOdd.splice(index, 1);
            }
            match.homeOdd.push(req.body.homeOdd);
            match.awayOdd.push(req.body.awayOdd);
            match.tieOdd.push(req.body.tieOdd);
            match.save();
            res.json(match);
        })
        .catch(err => res.status(400).json('Error ' + err));
});

router.route('/:matchId/bet').put((req, res) => {
    Matches.findByIdAndUpdate(req.params.matchId)
        .then(match => {
            match.homeWinUsers = req.body.homeWinUsers;
            match.tieUsers = req.body.tieUsers;
            match.awayWinUsers = req.body.awayWinUsers;
            match.save();
            res.json(match);
        });
});

router.route('/:matchId/result').put((req, res) => {
    //console.log(req.params);
    Matches.findByIdAndUpdate(req.params.matchId)
        .then(match => {
            if (match !== null) {
                match.goalsHomeTeam = req.body.goalsHomeTeam;
                match.goalsAwayTeam = req.body.goalsAwayTeam;

                match.save();
            }
            res.json(match);
        })
        .catch(err => {console.log(err)});
});

router.route('/:matchId/status').put((req, res) => {
    console.log(req.params);
    Matches.findByIdAndUpdate(req.params.matchId)
        .then(match => {
            console.log(match);
            if (match !== null) {
                match.statusShort = req.body.statusShort;
                match.save();
            }
            res.json(match);
        })
        .catch(err => {console.log(err)});
});

module.exports = router;

