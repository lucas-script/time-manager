const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const moment = require('moment')

const User = require('../models/user')
const Task = require('../models/task')

let loggedUser

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

    let q
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

    let user = req.query.user
    let sdate = req.query.sdate
    let edate = req.query.edate


    if (loggedUser.role === 'regular') {
        // regular users can access only theirs own
        user = loggedUser._id
    }

    let sdateISO = moment(sdate).toISOString()
    let edateISO = moment(edate).toISOString()

    let aggregateOpts = [
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

    let q = Task.aggregate(aggregateOpts)

    q.exec().then(ts => {

        res.status(200)
        return res.json({ data: ts })
    }).catch(err=> {

        res.status(err.status || 500)
        return res.json(err)
    })
})

module.exports = router
