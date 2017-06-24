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

    var q
    if (loggedUser.role === 'admin') {
        q = User.find({})
    } else {
        q = User.find({ _id: loggedUser._id })
    }

    q.select('_id name email password role workload workloadEnable')

    q.exec().then(function (users) {

        res.status(200)
        return res.json({ data: users })

    }).catch(function (err) {

        res.status(err.status || 500)
        return res.json(err)
    })
})

router.get('/', (req, res, next) => {

    var user = req.query.user
    var sdate = req.query.sdate
    var edate = req.query.edate


    if (loggedUser.role === 'regular') {
        // regular users can access only theirs own
        user = loggedUser._id
    }

    var sdateISO = moment(sdate).toISOString()
    var edateISO = moment(edate).toISOString()

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

    var q = Task.aggregate(aggregateOpts)

    q.exec().then(ts => {

        res.status(200)
        return res.json({ data: ts })
    }).catch(err=> {

        res.status(err.status || 500)
        return res.json(err)
    })
})

module.exports = router
