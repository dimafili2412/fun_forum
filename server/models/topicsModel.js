const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TopicsSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    order: {
        type: Number,
        default: 0,
    },
});

module.exports = Topic = mongoose.model('Topic', TopicsSchema);
