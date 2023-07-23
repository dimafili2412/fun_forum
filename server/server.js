require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const log = require('./logger/logger');
const connectToMongoDb = require('./DB/connectToMongoDB');

//import routers
const authRouter = require('./routers/authRouter');
const topicsRouter = require('./routers/topicsRouter');
const threadsRouter = require('./routers/threadsRouter');
const postsRouter = require('./routers/postsRouter');

const httpPort = process.env.HTTP_PORT || 3000;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//routers
app.use('/user', authRouter);
app.use('/topics', topicsRouter);
app.use('/threads', threadsRouter);
app.use('/posts', postsRouter);

app.listen(httpPort, () => {
    log.info(`Server is running on http port ${httpPort}`);
    connectToMongoDb();
});
