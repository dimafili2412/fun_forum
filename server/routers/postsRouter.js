const express = require('express');
const auth = require('../middleware/authMiddleWare');
const { getPostsByThreadId, postPost, deletePost, updatePost } = require('../controllers/postsController');

const postsRouter = express.Router();

postsRouter.get('/:topic_id', getPostsByThreadId);
postsRouter.post('/', auth, postPost);
postsRouter.delete('/:id', auth, deletePost);
postsRouter.patch('/:id', auth, updatePost);

module.exports = postsRouter;
