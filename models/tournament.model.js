const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
        name: {type: String, required: true},
        totalScore: {type: Number, required: true},
        weeklyScore: {type: Number, required: true}
    },
    {
        timestamps: true
    }
);

const TournamentSchema = new Schema({
        tournamentName: {type: String, required: true},
        tournamentLeagueId: {type: Number, required: true},
        tournamentUsers: {type: [User], required: false}
    },
    {
        timestamps: true
    }
);

const Tournament = mongoose.model('Tournament', TournamentSchema);

module.exports = Tournament;
