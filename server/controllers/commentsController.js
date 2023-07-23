const Comment = require('../models/commentsModel');
const log = require('../logger/logger');

const defaultPageSize = 10;

//GET comments by post id with pagination
exports.getCommentsByPostId = async (req, res, next) => {
    const { post_id } = req.params;
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || defaultPageSize;
    try {
        const comments = await Comment.find({ post_id: post_id, deleted: false })
            .skip((page - 1) * pageSize)
            .limit(pageSize);
        res.status(200).json(comments);
    } catch (err) {
        log.error(`Error getting comments for post id:${post_id}`, err);
        res.status(500).json({ message: err.message });
    }
};

//POST a new comment
exports.postComment = async (req, res, next) => {
    const { body, post_id } = req.body;
    const created_by_user_id = req.user.id;
    const created_by_user_display_name = req.user.display_name;
    try {
        const comment = new Comment({ body, created_by_user_id, created_by_user_display_name, post_id });
        const createdComment = await comment.save();
        log.info(`Created comment`, createdComment);
        res.status(201).json(createdComment);
    } catch (err) {
        log.error(`Error creating comment for post_id: ${post_id}`, err);
        res.status(400).json({ message: err.message });
    }
};

//DELETE a comment by id
exports.deleteComment = async (req, res, next) => {
    const { id } = req.params;
    try {
        const deletedComment = await Comment.findByIdAndUpdate(
            id,
            { deleted: true, deleted_by_user_id: req.user.id, deleted_by_user_display_name: req.user.display_name, deleted_date: Date.now() },
            { new: true }
        );
        res.status(200).json(deletedComment);
    } catch (err) {
        log.error(`Error deleting comment id: ${id}`, err);
        res.status(500).json({ message: err.message });
    }
};

// UPDATE a comment by id
exports.updateComment = async (req, res, next) => {
    const { id } = req.params;
    const { body } = req.body;
    // Check if body was provided for update
    if (!body) {
        log.error(`Updating comment id: ${id} failed because no fields were provided`);
        return res.status(400).json({ message: 'No fields to update were provided' });
    }
    let updates = {
        ...(body && { body }),
        edited_date: Date.now(),
    };
    try {
        const updatedComment = await Comment.findByIdAndUpdate(id, updates, { new: true });
        res.status(200).json(updatedComment);
    } catch (err) {
        log.error(`Error updating comment id: ${id}`, err);
        res.status(500).json({ message: err.message });
    }
};
