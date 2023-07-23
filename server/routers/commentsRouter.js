const express = require('express');
const auth = require('../middleware/authMiddleWare');
const { getCommentsByPostId, postComment, deleteComment, updateComment } = require('../controllers/commentsController');

const commentsRouter = express.Router();

commentsRouter.get('/:post_id', getCommentsByPostId);
commentsRouter.post('/', auth, postComment);
commentsRouter.delete('/:id', auth, deleteComment);
commentsRouter.patch('/:id', auth, updateComment);

module.exports = commentsRouter;
