const express = require('express');
const auth = require('../middleware/authMiddleWare');
const { getAllTopics, getTopicById, postTopic, updateTopic, deleteTopic } = require('../controllers/topicsController');

const topicsRouter = express.Router();

topicsRouter.get('/', getAllTopics);
topicsRouter.get('/:id', getTopicById);
topicsRouter.post('/', postTopic);
topicsRouter.patch('/:id', updateTopic);
topicsRouter.delete('/:id', deleteTopic);

module.exports = topicsRouter;
