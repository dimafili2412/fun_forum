const jwt = require('jsonwebtoken');
const User = require('../models/usersModel');
const log = require('../logger/logger');

module.exports = async function (req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) {
        log.error('No token provided');
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Fetch the user from the database and attach to the request object
        req.user = await User.findById(decoded.user.id);
        if (!req.user) {
            log.error(`User (id: ${decoded}) not found`);
            return res.status(404).json({ msg: 'User not found' });
        }
        next();
    } catch (err) {
        log.error(`Error decoding token: ${token}`, err);
        res.status(401).json({ msg: 'Token is not valid' });
    }
};
