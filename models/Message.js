const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Message table
 */
const messageSchema = new Schema({
    text: {
        type: String,
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    room: {
        type: Schema.Types.ObjectId,
        ref: 'Room'
    },
    fileLink: {
        type: String
    },
    createdAt: {
        type: String
    }
});

const Message = mongoose.model('Message', messageSchema);

module.exports = {
    Message
};
