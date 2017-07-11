var mongoose = require('mongoose')
var Schema = mongoose.Schema
var ObjectId = Schema.Types.ObjectId

var TaskSchema = new Schema({
    user: { type: ObjectId, ref: 'User' },
    project: { type: ObjectId, ref: 'Project' },
    name: { type: String, required: true },
    date: { type: Date, required: true },
    durationInMin: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Task', TaskSchema, 'tasks')
