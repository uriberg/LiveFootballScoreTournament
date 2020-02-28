const router = require('express').Router();
let Tournament = require('../models/tournament.model');


router.route('/').get((req, res) => {
    Tournament.find()
        .then(tournaments => {
            res.json(tournaments)
        })
        .catch(err => res.status(400).json('Error ' + err));
});

router.route('/:tournamentId').get((req, res) => {
    Tournament.findById(req.params.tournamentId)
        .then(tournament => {
            //console.log(tournament);
            res.json(tournament);
        })
        .catch(err => res.status(400).json('Error ' + err));
});

router.route('/:tournamentId/matches/:desiredRound').get((req, res) => {
    Tournament.findById(req.params.tournamentId)
        .then(tournament => {
            //console.log(tournament);
            let matchesToSend = [];
            for(let i = 0; i < tournament.tournamentMatches.length; i++){
                if (tournament.tournamentMatches[i].round === req.params.desiredRound){
                    matchesToSend.push(tournament.tournamentMatches[i]);
                }
            }
            res.json(matchesToSend);
        })
        .catch(err => res.status(400).json('Error ' + err));
});

router.route('/:tournamentId/matches/:matchId').get((req, res) => {
    Tournament.findById(req.params.tournamentId)
        .then(tournament => {
            //console.log(tournament);
            for(let i = 0; i < tournament.tournamentMatches.length; i++){
                if (tournament.tournamentMatches[i]._id === req.params.matchId){
                    res.json(tournament.tournamentMatches[i]);
                }
            }
        })
        .catch(err => res.status(400).json('Error ' + err));
});

router.route('/:tournamentId/matches/:matchId/odds').put((req, res) => {
    Tournament.findByIdAndUpdate(req.params.tournamentId)
        .then(tournament => {
            //console.log(tournament);
            for(let i = 0; i < tournament.tournamentMatches.length; i++){
                if (tournament.tournamentMatches[i]._id === +req.params.matchId){
                    console.log('there is a match');
                    tournament.tournamentMatches[i].homeOdd = +req.body.homeOdd;
                    tournament.tournamentMatches[i].tieOdd = +req.body.tieOdd;
                    tournament.tournamentMatches[i].awayOdd = +req.body.awayOdd;
                    console.log(tournament.tournamentMatches[i]);
                    tournament.save();
                    console.log(tournament);
                    break;
                }
            }
            res.json(tournament);

        })
        .catch(err => res.status(400).json('Error ' + err));
});

router.route('/newTournament').post((req, res) => {
    //console.log(req.body);
    //console.log(req.body.newTournament.tournamentUsers[0]);
    const newTournament = new Tournament ({
        tournamentName: req.body.newTournament.tournamentName,
        tournamentLeagueId: req.body.newTournament.tournamentLeagueId,
        tournamentUsers: req.body.newTournament.tournamentUsers,
        tournamentOddsSource: req.body.newTournament.tournamentOddsSource,
        lastRecordedRound: '',
    });
   // console.log(newTournament);

    newTournament.save()
        .then(() => res.json(newTournament))
        .catch(err => res.status(400).json('Error ' + err));
});

router.route('/:tournamentId/addUser').put((req, res) => {
   // console.log(req.body);
    Tournament.findByIdAndUpdate(req.params.tournamentId)
        .then(tournament => {
            tournament.tournamentUsers = req.body.users;
            tournament.save();
            res.json(tournament);
        })
        .catch(err => res.status(400).json('Error ' + err));
});

router.route('/:tournamentId/updateUsersScore').put((req, res) => {
    //console.log('update score: ' + req.body);
    Tournament.findByIdAndUpdate(req.params.tournamentId)
        .then(tournament => {
            tournament.tournamentUsers = req.body.users;
            tournament.save();
            res.json(tournament);
        })
        .catch(err => res.status(400).json('Error ' + err));
});

router.route('/:tournamentId/updateCurrentRound').put((req, res) => {
    Tournament.findByIdAndUpdate(req.params.tournamentId)
        .then(tournament => {
            tournament.lastRecordedRound = req.body.newRecordedRound;
            //tournament.tournamentUsers = req.body.updatedTotalScore;
           // console.log(tournament);
            tournament.save();
            res.json(tournament);
        })
        .catch(err => res.status(400).json('Error ' + err));
});

router.route('/:tournamentId/matches').put((req, res) => {
    Tournament.findByIdAndUpdate(req.params.tournamentId)
        .then(tournament => {
            for(let i = 0; i < req.body.tournamentMatches.length; i++){
                tournament.tournamentMatches.push(req.body.tournamentMatches[i]);
            }
            //console.log(tournament);
            tournament.save();
            res.json(tournament);
        })
        .catch(err => res.status(400).json('Error ' + err));
});


router.route('/:id').delete((req, res) => {
    Tournament.findByIdAndDelete(req.params.id)
        .then(res.json('Tournament Deleted!'))
        .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;

