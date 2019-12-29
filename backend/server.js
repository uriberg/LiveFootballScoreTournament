const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

if (process.env.NODE_ENV === 'production') {
    // Serve any static files
    app.use(express.static(path.join(__dirname, 'client/build')));
    // Handle React routing, return all requests to React app
    app.get('*', (request, response) => {
        response.sendFile(path.join(__dirname, 'client/build', 'index.tsx'))
    })
}

app.use(cors());
app.use(express.json());

const uri = process.env.MONGO_URI || process.env.LiveBet_URI;
mongoose.connect(uri, {userNewUrlParser: true, useCreateIndex: true});//flags are needed for taking care of MongoDB updates changes
const connection = mongoose.connection;
connection.once('open', () => {
    console.log('MongoDB database connection extablished successfully');
});

const matchesRouter = require('./routes/matches');
const usersRouter = require('./routes/users');

app.use('/matches', matchesRouter);
app.use('/users',usersRouter);


app.listen(port, () => {
    console.log(`Server is running on port: ${port})`);
});
