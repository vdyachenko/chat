const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Room table
 */
const roomSchema = new Schema({
    name: {
        type: String,
        required: true,
        minlength: [3, 'Room name should be at least 3 characters long'],
        validate: {
            validator: function(v) {
                return /^[a-zA-Z]+$/.test(v);
            },
            message: 'Room name can contain only letters!'
        },
        unique: true
    }
});

const Room = mongoose.model('Room', roomSchema);

module.exports = {
    Room
};

