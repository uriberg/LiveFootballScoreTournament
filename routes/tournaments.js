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
            console.log(tournament);
            res.json(tournament);
        })
        .catch(err => res.status(400).json('Error ' + err));
});

router.route('/newTournament').post((req, res) => {
    console.log(req.body);
    console.log(req.body.newTournament.tournamentUsers[0]);
    const newTournament = new Tournament ({
        tournamentName: req.body.newTournament.tournamentName,
        tournamentLeagueId: req.body.newTournament.tournamentLeagueId,
        tournamentUsers: req.body.newTournament.tournamentUsers
    });
    console.log(newTournament);

    newTournament.save()
        .then(() => res.json(newTournament))
        .catch(err => res.status(400).json('Error ' + err));
});


module.exports = router;

