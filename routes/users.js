

const router = require('express').Router();
let User = require('../models/user.model');

router.route('/').get((req, res) => {
    User.find()
        .then(users => {
            res.json(users)
        })
        .catch(err => res.status(400).json('Error ' + err));
});

// router.route('/:matchId').get((req, res) => {
//     Matches.findById(req.params.matchId)
//         .then(match => {
//             console.log(match);
//             res.json(match);
//         })
//         .catch(err => res.status(400).json('Error ' + err));
// });

router.route('/newUser').post((req, res) => {
    console.log(req.body);
    const newUser = new User ({
        name: req.body.username,
        totalScore: req.body.totalScore,
        weeklyScore: req.body.weeklyScore
    });

    newUser.save()
        .then(() => res.json(newUser))
        .catch(err => res.status(400).json('Error ' + err));
});

router.route('/:userId/updateScore').put((req,res) => {
   console.log(req.body);
   User.findByIdAndUpdate(req.params.userId)
       .then(user => {
           user.weeklyScore = req.body.weeklyScore;
           user.save();
           res.json(user);
       })
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
// router.route('/:matchId/odds').put((req,res) => {
//     Matches.findByIdAndUpdate(req.params.matchId)
//         .then(match => {
//             match.homeOdd = req.body.homeOdd;
//             match.awayOdd = req.body.awayOdd;
//             match.tieOdd = req.body.tieOdd;
//             match.save();
//             res.json(match);
//         })
//         .catch(err => res.status(400).json('Error ' + err));
// });
//
// router.route('/:matchId/bet').put((req,res) => {
//     Matches.findByIdAndUpdate(req.params.matchId)
//         .then(match => {
//             match.homeWinUsers = req.body.homeWinUsers;
//             match.tieUsers = req.body.tieUsers;
//             match.awayWinUsers = req.body.awayWinUsers;
//             match.save();
//             res.json(match);
//         });
// });

module.exports = router;

