const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
        _id: {type: String, required: true},
        name: {type: String, required: true},
        totalScore: {type: Number, required: false},
        weeklyScore: {type: Number, required: false},
        tournamentsId: {type: [], required: false},
        createdTournaments: {type: [], required: false}
    },
    {
        timestamps: true
    }
);

const User = mongoose.model('User', UserSchema);

module.exports = User;
