var mongoose = require('mongoose')
var Schema = mongoose.Schema

var ProjectSchema = new Schema({
    name: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Project', ProjectSchema, 'projects')
