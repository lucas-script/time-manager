var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TaskSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    durationInMin: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Task', TaskSchema, 'tasks');