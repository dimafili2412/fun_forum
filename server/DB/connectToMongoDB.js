const env = process.env.NODE_ENV;

module.exports = () => {
    if (env === 'development') require('./mongoDB/local');
    if (env === 'production') require('./mongoDB/atlas');
};
