require('dotenv').config();

const env = process.env.NODE_ENV;

const connectToMongoDb = () => {
    if (env === 'development') require('./mongoDB/local');
    if (env === 'production') require('./mongoDB/atlas');
};

module.exports = connectToMongoDb;
