const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
        name: {type: String, required: true},
        totalScore: {type: Number, required: true},
        weeklyScore: {type: Number, required: true}
    },
    {
        timestamps: true
    }
);

const User = mongoose.model('User', UserSchema);

module.exports = User;
