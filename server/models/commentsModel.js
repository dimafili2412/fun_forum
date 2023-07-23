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
    post_id: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: true,
    },
});

module.exports = Comment = mongoose.model('Comment', CommentsSchema);
