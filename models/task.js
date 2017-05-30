var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var TaskSchema = new Schema({
    user: {
        type: ObjectId,
        ref: 'User'
    },
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
