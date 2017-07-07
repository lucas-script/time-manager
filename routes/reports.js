var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')
var ObjectId = mongoose.Types.ObjectId
var moment = require('moment')

var User = require('../models/user')
var Task = require('../models/task')

var loggedUser

router.use((req, res, next) => {

    loggedUser = req.tokenObj.user

    // manager cant access task reports
    if (loggedUser.role === 'manager') {
        res.status(401)
        return res.json({ message: 'Unauthorized' })
    } else{
        next()
    }
})

router.get('/users', (req, res, next) => {

    var query
    if (loggedUser.role === 'admin') {
        query = User.find({})
    } else {
        query = User.find({ _id: loggedUser._id })
    }

    query.select('_id name email password role workload workloadEnable')

    query.exec().then(function (users) {

        res.status(200)
        return res.json({ data: users })

    }).catch(function (err) {

        res.status(err.status || 500)
        return res.json(err)
    })
})

router.get('/', (req, res, next) => {

    var user = req.query.user
    // start date
    var sdate = req.query.sdate
    // end date
    var edate = req.query.edate

    if (loggedUser.role === 'regular') {
        // regular users can access only theirs own
        user = loggedUser._id
    }

    // formating dates
    var sdateISO = moment(sdate).toISOString()
    var edateISO = moment(edate).toISOString()

    // mongoose aggregate options
    var aggregateOpts = [
        {
            $match: {
                user: ObjectId(user),
                date: { $gte: new Date(sdateISO), $lte: new Date(edateISO) }
            }
        },
        {
            $group: {
                _id: "$date",
                tasks: { $push: { task: "$name" } },
                tasksSum: { "$sum": "$durationInMin" }
            }
        }
    ]

    var query = Task.aggregate(aggregateOpts)

    query.exec().then((tasks) => {

        res.status(200)
        return res.json({ data: tasks })
    }).catch(err=> {

        res.status(err.status || 500)
        return res.json(err)
    })
})

module.exports = router
