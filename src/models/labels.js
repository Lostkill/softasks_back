const mongoose = require('mongoose');

const labelSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    task: {
        type: mongoose.Schema.Types.ObjectId,
        ref: '_task_',
    }
});

module.exports = mongoose.model('Label', labelSchema)