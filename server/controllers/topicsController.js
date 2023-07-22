const Topic = require('../models/topicsModel');
const log = require('../logger/logger');

//GET all topics
exports.getAllTopics = async (req, res, next) => {
    try {
        const topics = await Topic.find();
        res.status(200).json(topics);
    } catch (err) {
        log.error(`Error getting all topics`, err);
        res.status(500).json({ message: err.message });
    }
};

//GET topic by id
exports.getTopicById = async (req, res, next) => {
    try {
        const topic = await Topic.findById(req.params.id);
        if (!topic) {
            log.error(`Error getting topic id:${req.params.id}, topic not found, 404`);
            return res.status(404).json({ message: 'Topic not found' });
        }
        res.status(200).json(topic);
    } catch (err) {
        log.error(`Error getting topic id:${req.params.id}`, err);
        res.status(500).json({ message: err.message });
    }
};

//POST new topic
exports.postTopic = async (req, res, next) => {
    const { title, description } = req.body;
    try {
        const topic = new Topic({ title, description });
        const createdTopic = await topic.save();
        res.status(201).json(createdTopic);
        log.info(`Created topic`, createdTopic);
    } catch (err) {
        log.error(`Error creating topic `, topic, err);
        res.status(400).json({ message: err.message });
    }
};

//PATCH topic by id
exports.updateTopic = async (req, res, next) => {
    const { id } = req.params;
    const { title, description, order } = req.body;
    try {
        const topic = await Topic.findById(id);
        //make sure topic with id exists
        if (!topic) {
            log.error(`Error updating topic id:${id}, topic not found, 404`);
            return res.status(404).json({ message: 'Topic not found' });
        }
        if (title !== undefined) topic.title = title;
        if (description !== undefined) topic.description = description;
        if (order !== undefined) topic.order = order;
        const updatedTopic = await topic.save();
        log.info(`Updated topic`, updatedTopic);
        res.status(200).json(updatedTopic);
    } catch (err) {
        log.error(`Error updating topic id:${id}`, err);
        res.status(400).json({ message: err.message });
    }
};

//DELETE topic by id
exports.deleteTopic = async (req, res, next) => {
    const { id } = req.params;
    try {
        const topic = await Topic.findById(id);
        //make sure topic with id exists
        if (!topic) {
            log.error(`Error deleting topic id:${id}, topic not found, 404`);
            return res.status(404).json({ message: 'Topic not found' });
        }
        await Topic.findByIdAndRemove(id);
        log.info(`Deleted topic id:${id}`);
        res.status(200).json({ message: 'Topic successfully deleted' });
    } catch (err) {
        log.error(`Error deleting topic id:${id}`, err);
        res.status(500).json({ message: err.message });
    }
};
