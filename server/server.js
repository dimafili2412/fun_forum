require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const log = require('./logger/logger');
const connectToMongoDb = require('./DB/connectToMongoDB');

//import routers
const authRouter = require('./routers/authRouter');

const httpPort = process.env.HTTP_PORT || 3000;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//routers
app.get('/', (req, res) => {
    res.send('Test!');
});

app.use('/user', authRouter);

app.listen(httpPort, () => {
    log.info(`Server is running on http port ${httpPort}`);
    connectToMongoDb();
});
