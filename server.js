const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.enable('trust proxy');

app.use (function (req, res, next) {
    if (req.secure) {
        // request was via https, so do no special handling
        next();
    } else {
        // request was via http, so redirect to https
        res.redirect('https://' + req.headers.host + req.url);
    }
});

if (process.env.NODE_ENV === 'production') {
    // Serve any static files
    app.use(express.static('client/build'));
    // Handle React routing, return all requests to React app
}

app.use(cors());
app.use(express.json());






// const uri = process.env.MONGO_URI || 'mongodb://uriberg:uriberg2@ds011870.mlab.com:11870/uriberg';
//const uri = 'mongodb://uriberg:uriberg2@ds011870.mlab.com:11870/';
const uri = process.env.LiveBet_URI;
mongoose.connect(uri, {userNewUrlParser: true, useCreateIndex: true});//flags are needed for taking care of MongoDB updates changes
const connection = mongoose.connection;
connection.once('open', () => {
    console.log('MongoDB database connection extablished successfully');
});

const matchesRouter = require('./routes/matches');
const usersRouter = require('./routes/users');
const tournamentsRouter = require('./routes/tournaments');

app.use('/matches', matchesRouter);
app.use('/users', usersRouter);
app.use('/tournaments', tournamentsRouter);


app.listen(port, () => {
    console.log(`Server is running on port: ${port})`);
});
