const Thread = require('../models/threadsModel');
const Topic = require('../models/topicsModel');
const log = require('../logger/logger');

const defaultPageSize = 10;

//GET threads by topic id with pagination
exports.getThreadsByTopicId = async (req, res, next) => {
    const { topic_id } = req.params;
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || defaultPageSize;
    try {
        const threads = await Thread.find({ topic_id: topic_id, deleted: false })
            .skip((page - 1) * pageSize)
            .limit(pageSize);
        res.status(200).json(threads);
    } catch (err) {
        log.error(`Error getting threads for topic id:${id}`, err);
        res.status(500).json({ message: err.message });
    }
};

//POST a new thread
exports.postThread = async (req, res, next) => {
    const { title, body, topic_id } = req.body;
    const created_by_user_id = req.user.id;
    const created_by_user_display_name = req.user.display_name;
    try {
        const thread = new Thread({ title, body, created_by_user_id, created_by_user_display_name, topic_id });
        const createdThread = await thread.save();
        log.info(`Created thread`, createdThread);
        res.status(201).json(createdThread);
    } catch (err) {
        log.error(`Error creating thread title: ${title}, for topic_id: ${topic_id}`, err);
        res.status(400).json({ message: err.message });
    }
};

//DELETE a thread by id
exports.deletedThread = async (req, res, next) => {
    const { id } = req.params;
    try {
        const deletedThread = await Thread.findByIdAndUpdate(
            id,
            { deleted: true, deleted_by_user_id: req.user.id, deleted_by_user_display_name: user.display_name, deleted_date: Date.now() },
            { new: true }
        );
        res.status(200).json(deletedThread);
    } catch (err) {
        log.error(`Error deleting thread id: ${id}`, err);
        res.status(500).json({ message: err.message });
    }
};

// UPDATE a thread by id
exports.updateThread = async (req, res, next) => {
    const { id } = req.params;
    const { title, body, topic_id } = req.body;
    // If topic_id was passed make sure such topic exists before updating
    if (topic_id) {
        try {
            const topic = await Topic.findById(topic_id);
            if (!topic) {
                log.error(`Topic: topic_id: ${topic_id} was not found, failed to update thread id: ${id}`);
                return res.status(400).json({ message: 'Topic does not exist' });
            }
        } catch (err) {
            log.error(`Error while searching for topic_id: ${topic_id} when updating thread id: ${id}`, err);
            return res.status(500).json({ message: err.message });
        }
    }
    // Check if at least one of title, body or topic_id was provided for update
    if (!title && !body && !topic_id) {
        log.error(`Updatring thread id: ${id} failed because no fields were provided`);
        return res.status(400).json({ message: 'No fields to update were provided' });
    }
    let updates = {
        ...(title && { title }),
        ...(body && { body }),
        ...(topic_id && { topic_id }),
        edited_date: Date.now(),
    };
    try {
        const updatedThread = await Thread.findByIdAndUpdate(id, updates, { new: true });
        res.status(200).json(updatedThread);
    } catch (err) {
        log.error(`Error updating thread id: ${id}`, err);
        res.status(500).json({ message: err.message });
    }
};
