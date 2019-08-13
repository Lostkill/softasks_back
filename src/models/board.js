const moongose = require('mongoose');

const boardSchema = new moongose.Schema({
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

    creator: {
        type: String,
        required: true
    },

    tasks: [],

    createdAt: {
        type: String
    }
});

module.exports = moongose.model('board', boardSchema);