var mongoose = require('mongoose')
var Schema = mongoose.Schema
var bcrypt = require('bcrypt-nodejs')

var UserSchema = new Schema({
    name: { type : String },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true, default: 'regular', enum: ['regular', 'manager', 'admin'] },
    workload: { type: Number, default: false },
    workloadEnable: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
})

// encrypting the password before save
UserSchema.pre('save', function (next) {
    var user = this
    // password was not modified
    if (!user.isModified('password')) {
        return next()
    }
    // otherwise
    bcrypt.hash(user.password, null, null, function (err, hash) {
        if (err) next(err)

        user.password = hash
        next()
    })
})

// check password
UserSchema.methods.checkPassword = function (password) {
    var user = this
    return bcrypt.compareSync(password, user.password)
}

module.exports = mongoose.model('User', UserSchema, 'users')
