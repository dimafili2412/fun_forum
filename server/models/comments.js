const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentsSchema = new Schema({
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
    post_id: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: true,
    },
});

module.exports = Comment = mongoose.model('Post', CommentsSchema);
