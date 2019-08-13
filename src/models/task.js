const moongose = require('mongoose');

const taskSchema = new moongose.Schema({
    title: {
        type: String,
        required: true
    },

    description: {
        type: String
    },

    status: {
        type: String,
        required: true
    },

    board: {
        type: moongose.Schema.Types.ObjectId,
        ref: '_board_',
    },

    createdAt: {
        type: String
    }
});

module.exports = moongose.model('task', taskSchema);