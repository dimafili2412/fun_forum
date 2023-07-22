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
        default: false,
    },
    deleted_date: {
        type: Date,
    },
    deleted_by_user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    //
    created_by_user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    created_by_user_display_name: {
        type: String,
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
