// preferred working hours per day

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FavoriteHoursSchema = new Schema({
    mo: {
        startHour: Number,
        endHour: Number
    },
    tu: {
        startHour: Number,
        endHour: Number
    },
    we: {
        startHour: Number,
        endHour: Number
    },
    th: {
        startHour: Number,
        endHour: Number
    },
    fr: {
        startHour: Number,
        endHour: Number
    },
    sa: {
        startHour: Number,
        endHour: Number
    },
    su: {
        startHour: Number,
        endHour: Number
    }
});

module.exports = mongoose.model('FavoriteHours', FavoriteHoursSchema, 'favoriteHours')