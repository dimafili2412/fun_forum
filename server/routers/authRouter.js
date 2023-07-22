const express = require('express');
const { register, login, logout, checkDisplayName, checkEmail } = require('../controllers/authController');

const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.get('/logout', logout);
authRouter.get('/checkDisplayName/:display_name', checkDisplayName);
authRouter.get('/checkEmail/:email', checkEmail);

module.exports = authRouter;
