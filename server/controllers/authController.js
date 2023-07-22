const User = require('../models/usersModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const log = require('../logger/logger');

const { validatePassword, validateEmail } = require('../utils/validators');

// User Registration
exports.register = async (req, res) => {
    const { first_name, last_name, middle_name, email, display_name, password } = req.body;
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
    if (!display_name) {
        log.error(`User register failed because no display name has been provided, Email: ${email}`);
        return res.status(400).json({ msg: 'Display name is required' });
    }
    try {
        let user = await User.findOne({ email });
        if (user) {
            log.error(`User with Email: ${user.email}, already exists`);
            return res.status(400).json({ msg: 'Email already exists' });
        }
        user = await User.findOne({ display_name });
        if (user) {
            log.error(`User with display_name: ${user.display_name}, already exists`);
            return res.status(400).json({ msg: 'Display name already exists' });
        }
        user = new User({
            first_name,
            last_name,
            middle_name,
            email,
            display_name,
            password,
        });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();
        const payload = {
            user: {
                id: user.id,
            },
        };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 1000 * 60 * 60 * 24 /* 24 hours */ }, (err, token) => {
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
    //TDODO: implement login by mail or username
    const { email, password } = req.body;
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

// Check uniqueness of display name
exports.checkDisplayName = async (req, res) => {
    const { display_name } = req.params;
    if (!display_name) {
        log.error('No display name has been provided for uniqueness check');
        return res.status(400).json({ msg: 'Display name is required' });
    }
    try {
        let user = await User.findOne({ display_name });
        if (user) {
            return res.status(400).json({ msg: 'Display name already exists' });
        }
        log.info(`Display name ${display_name} is available`);
        res.status(200).json({ msg: 'Display name is available' });
    } catch (err) {
        log.error('Failed checking display name uniqueness', display_name, err.message);
        res.status(500).send('Server error');
    }
};

// Check uniqueness of email
exports.checkEmail = async (req, res) => {
    const { email } = req.params;
    if (!email) {
        log.error('No email has been provided for uniqueness check');
        return res.status(400).json({ msg: 'Email is required' });
    }
    if (!validateEmail(email)) {
        log.error(`Check Email uniqueness failed with invalid Email ${email}`);
        return res.status(400).json({ msg: 'Invalid email' });
    }
    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'Email already exists' });
        }
        log.info(`Email ${email} is available`);
        res.status(200).json({ msg: 'Email is available' });
    } catch (err) {
        log.error('Failed checking email uniqueness', email, err.message);
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
