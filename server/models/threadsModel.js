const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ThreadsSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    body: {
        type: String,
        required: true,
        trim: true,
    },
    created_date: {
        type: Date,
        default: Date.now,
    },
    edited_date: {
        type: Date,
    },
    //soft delete
    deleted: {
        type: Boolean,
        default: falses,
    },
    created_by_user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    topic_id: {
        type: Schema.Types.ObjectId,
        ref: 'Topic',
        required: true,
    },
});

module.exports = Thread = mongoose.model('Thread', ThreadsSchema);
