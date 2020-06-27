const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sendGrid = require('@sendgrid/mail');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();

app.use(bodyParser.json());

// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'Control-Type, Authorization');
//     next();
// });



const port = process.env.PORT || 5000;

app.enable('trust proxy');



if (process.env.NODE_ENV === 'production') {

    app.use (function (req, res, next) {
        if (req.secure) {
            // request was via https, so do no special handling
            next();
        } else {
            // request was via http, so redirect to https
            res.redirect('https://' + req.headers.host + req.url);
        }
    });
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

app.get('/api', (req, res, next) => {
    res.send('API Status: Running');
});

app.post('/api/email', (req, res, next) => {

    console.log(req.body.email);
    console.log(process.env.LiveBet_EMAIL);
    sendGrid.setApiKey(process.env.LiveBet_EMAIL);
    const msg = {
        to: req.body.email,
        from: 'uribe1927@gmail.com',
        subject: 'Invitation to join a new league',
        text: 'You have been invited to a new league! join it using this code: ' + req.body.code
    };

    sendGrid.send(msg)
        .then(result => {
            res.status(200).json({
                success: true
            });
        })
        .catch(err => {
            console.log(err);
            res.status(401).json({
                success: false
            });
        });
});


app.listen(port, () => {
    console.log(`Server is running on port: ${port})`);
});
