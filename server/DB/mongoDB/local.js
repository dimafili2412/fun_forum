const mongoose = require('mongoose');
const log = require('../../logger/logger');

mongoose
    .connect('mongodb://127.0.0.1:27017/fun_forum')
    .then(() => log.info('Connected to MongoDb locally'))
    .catch((error) => log.error(`Could not connect to mongoDb: ${error}`));
