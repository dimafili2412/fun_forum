const express = require('express');
const auth = require('../middleware/authMiddleWare');
const { getAllTopics, getTopicById, postTopic, updateTopic, deleteTopic } = require('../controllers/topicsController');

const topicsRouter = express.Router();

topicsRouter.get('/', getAllTopics);
topicsRouter.get('/:id', getTopicById);
topicsRouter.post('/', auth, postTopic);
topicsRouter.patch('/:id', auth, updateTopic);
topicsRouter.delete('/:id', auth, deleteTopic);

module.exports = topicsRouter;
