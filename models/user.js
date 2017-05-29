var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var UserSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        default: 'regular',
        enum: ['regular', 'manager', 'admin']
    },
    inactive: {
        type: Boolean,
        default: false
    }
});

// encrypting the password before save
UserSchema.pre('save', function (next) {
    var user = this;
    // password was not modified
    if (!user.isModified('password')) {
        return next();
    }
    // otherwise
    bcrypt.hash(user.password, null, null, function (err, hash) {
        if (err) next(err);

        user.password = hash;
        next();
    });
});

// check password method
UserSchema.methods.checkPassword = function (p) {
    var user = this;
    return bcrypt.compareSync(p, user.password);
}

module.exports = mongoose.model('User', UserSchema, 'users');