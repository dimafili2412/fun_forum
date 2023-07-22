const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostsSchema = new Schema({
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
    thread_id: {
        type: Schema.Types.ObjectId,
        ref: 'Thread',
        required: true,
    },
});

module.exports = Post = mongoose.model('Post', PostsSchema);
