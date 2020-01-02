const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FixturesSchema = new Schema({
        matches: {type: [Match], required: true},
        currentRound: {type: String, required: true},
        leagueId: {type: Number, required: true}
    },
    {
        timestamps: true
    }
);

const Match = mongoose.model('Match', MatchSchema);

module.exports = Match;
