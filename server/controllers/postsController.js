const Thread = require('../models/threadsModel');
const Post = require('../models/postsModel');
const log = require('../logger/logger');

const defaultPageSize = 10;

//GET posts by thread id with pagination
exports.getPostsByThreadId = async (req, res, next) => {
    const { thread_id } = req.params;
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || defaultPageSize;
    try {
        const posts = await Post.find({ thread_id: thread_id, deleted: false })
            .skip((page - 1) * pageSize)
            .limit(pageSize);
        res.status(200).json(posts);
    } catch (err) {
        log.error(`Error getting posts for thread id:${thread_id}`, err);
        res.status(500).json({ message: err.message });
    }
};

//POST a new post
exports.postPost = async (req, res, next) => {
    const { body, thread_id } = req.body;
    const created_by_user_id = req.user.id;
    const created_by_user_display_name = req.user.display_name;
    try {
        const post = new Post({ body, created_by_user_id, created_by_user_display_name, thread_id });
        const createdPost = await post.save();
        log.info(`Created post`, createdPost);
        res.status(201).json(createdPost);
    } catch (err) {
        log.error(`Error creating post for thread_id: ${thread_id}`, err);
        res.status(400).json({ message: err.message });
    }
};

//DELETE a post by id
exports.deletePost = async (req, res, next) => {
    const { id } = req.params;
    try {
        const deletedPost = await Post.findByIdAndUpdate(
            id,
            { deleted: true, deleted_by_user_id: req.user.id, deleted_by_user_display_name: req.user.display_name, deleted_date: Date.now() },
            { new: true }
        );
        res.status(200).json(deletedPost);
    } catch (err) {
        log.error(`Error deleting post id: ${id}`, err);
        res.status(500).json({ message: err.message });
    }
};

// UPDATE a post by id
exports.updatePost = async (req, res, next) => {
    const { id } = req.params;
    const { body } = req.body;
    // Check if body was provided for update
    if (!body) {
        log.error(`Updating post id: ${id} failed because body field was not provided`);
        return res.status(400).json({ message: 'No fields to update were provided' });
    }
    let updates = {
        ...(body && { body }),
        edited_date: Date.now(),
    };
    try {
        const updatedPost = await Post.findByIdAndUpdate(id, updates, { new: true });
        res.status(200).json(updatedPost);
    } catch (err) {
        log.error(`Error updating post id: ${id}`, err);
        res.status(500).json({ message: err.message });
    }
};
