const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MatchSchema = new Schema({
        _id: {type: Number, required: true},
        homeTeamName: {type: String, required: true},
        awayTeamName: {type: String, required: true},
        statusShort: {type: String, required: true},
        goalsHomeTeam: {type: Number, required: false},
        goalsAwayTeam: {type: Number, required: false},
        homeOdd: {type: Number, required: false},
        tieOdd: {type: Number, required: false},
        awayOdd: {type: Number, required: false},
        homeWinUsers: {type: [], required: false},
        tieUsers: {type: [], required: false},
        awayWinUsers: {type: [], required: false},
        round: {type: String, required: true},
        leagueId: {type: Number, required: true}
    },
    {
        timestamps: true
    }
);

const Match = mongoose.model('Match', MatchSchema);

module.exports = Match;
