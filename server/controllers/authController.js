const User = require('../models/usersModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const log = require('../logger/logger');

const { validatePassword, validateEmail } = require('../utils/validators');

// User Registration
exports.register = async (req, res) => {
    const { firstName, lastName, middleName, email, password } = req.body;
    //validate user data
    if (!validateEmail(email)) {
        log.error(`User register invalid Email ${email}`);
        return res.status(400).json({ msg: 'Invalid email' });
    }
    if (!validatePassword(password)) {
        //log password in test enviroment and omit on productio nfor security reasons
        log.error(
            `User register invalid password, user Email: ${email}, ${
                process.env.NODE_ENV === 'development' ? `Password: ${password}` : 'password omitted for security reasons'
            }`
        );
        return res.status(400).json({ msg: 'Invalid password' });
    }
    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }
        user = new User({
            firstName,
            lastName,
            middleName,
            email,
            password,
        });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();
        //temp
        console.log(user.id);
        const payload = {
            user: {
                id: user.id,
            },
        };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
        log.info(`User ${user.email} registered successfully`, user);
    } catch (err) {
        log.error(`Failed registering user Email: ${email}`, err.message);
        res.status(500).send('Server error');
    }
};

// User Login
exports.login = async (req, res) => {
    const { email, password } = req.body;
    console.log(email, password);
    if (!validateEmail(email)) {
        log.error(`User login attempt with invalid Email ${email}`);
        return res.status(400).json({ msg: 'Invalid email' });
    }
    if (!validatePassword(password)) {
        //log password in test enviroment and omit on productio nfor security reasons
        log.error(
            `User login attempt with invalid password, user Email: ${email}, ${
                process.env.NODE_ENV === 'development' ? `Password: ${password}` : 'password omitted for security reasons'
            }`
        );
        return res.status(400).json({ msg: 'Invalid password' });
    }
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }
        const payload = {
            user: {
                id: user.id,
            },
        };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
        log.info(`User ${user.email} logged in successfully`);
    } catch (err) {
        log.error(`Failed logging in user, Email: ${email}`, err.message);
        res.status(500).send('Server error');
    }
};

// User Logout
exports.logout = (req, res) => {
    /*
    Temp
    TODO: implement token blacklist or delete token from FE
    */
    res.json({ msg: 'User logged out' });
};
