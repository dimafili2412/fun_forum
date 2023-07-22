const express = require('express');
const auth = require('../middleware/authMiddleWare');
const { getThreadsByTopicId, postThread, deletedThread, updateThread } = require('../controllers/threadsController');

const threadsRouter = express.Router();

threadsRouter.get('/:topic_id', getThreadsByTopicId);
threadsRouter.post('/', auth, postThread);
threadsRouter.delete('/:id', auth, deletedThread);
threadsRouter.patch('/:id', auth, updateThread);

module.exports = threadsRouter;
