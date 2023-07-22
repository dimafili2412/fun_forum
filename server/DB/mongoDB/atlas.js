const mongoose = require('mongoose');
require('dotenv').config();
const log = require('../../logger/logger');

const userName = process.env.ATLAS_USER_NAME;
const password = process.env.ATLAS_PASSWORD;

mongoose
    .connect(``)
    .then(() => log.info('Connected to MongoDb Atlas!'))
    .catch((error) => log.error(`Could not connect to mongoDb: ${error}`));
