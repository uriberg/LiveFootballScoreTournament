

const router = require('express').Router();
let Matches = require('../models/match.model');

router.route('/').get((req, res) => {
    Matches.find()
        .then(notes => {
            res.json(notes)
        })
        .catch(err => res.status(400).json('Error ' + err));
});

router.route('/:matchId').get((req, res) => {
    Matches.findById(req.params.matchId)
        .then(match => {
            console.log(match);
            res.json(match);
        })
        .catch(err => res.status(400).json('Error ' + err));
});

router.route('/add').post((req, res) => {
    console.log(req.body);
    const MatchId = req.body.matchId;
    const homeTeamName = req.body.homeTeamName;
    const awayTeamName = req.body.awayTeamName;
    console.log(homeTeamName);
    console.log(awayTeamName);
    const newMatch = new Matches ({
        _id: MatchId,
        homeTeamName: homeTeamName,
        awayTeamName: awayTeamName,
        statusShort: 'NS',
        goalsHomeTeam: null,
        goalsAwayTeam: null,
        homeOdd: null,
        tieOdd: null,
        awayOdd: null
    });

    newMatch.save()
        .then(() => res.json(newMatch))
        .catch(err => res.status(400).json('Error ' + err));
});

router.route('/newUser').post((req, res) => {
    console.log(req.body);
    const newMatch = new Matches ({
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
router.route('/:matchId/odds').put((req,res) => {
    Matches.findByIdAndUpdate(req.params.matchId)
        .then(match => {
            match.homeOdd = req.body.homeOdd;
            match.awayOdd = req.body.awayOdd;
            match.tieOdd = req.body.tieOdd;
            match.save();
            res.json(match);
        })
        .catch(err => res.status(400).json('Error ' + err));
});

router.route('/:matchId/bet').put((req,res) => {
    Matches.findByIdAndUpdate(req.params.matchId)
        .then(match => {
            match.homeWinUsers = req.body.homeWinUsers;
            match.tieUsers = req.body.tieUsers;
            match.awayWinUsers = req.body.awayWinUsers;
            match.save();
            res.json(match);
        });
});

router.route('/:matchId/result').put((req,res) => {
    Matches.findByIdAndUpdate(req.params.matchId)
        .then(match => {
            match.goalsHomeTeam = req.body.goalsHomeTeam;
            match.goalsAwayTeam = req.body.goalsAwayTeam;
            match.save();
            res.json(match);
        });
});

module.exports = router;

