var express = require('express')

var User = require('../models/user')
var Task = require('../models/task')

var router = express.Router()

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

router.get('/', (req, res, next) => {

    var query

    if (loggedUser.role === 'admin') {
        // admin user
        query = User.find({ workloadEnable: true })
    } else {
        // regular user
        query = User.find({ _id: loggedUser._id, workloadEnable: true })
    }

    query.select('_id workload')

    query.exec().then((workloads) => {

        res.status(200)
        return res.json({ data: workloads })
    }).catch((err) => {

        res.status(err.status || 500)
        return res.json(err)
    })
})

router.get('/tasksSum', (req, res, next) => {

    var aggregateOpts = [
        {
            $group: {
                _id: { date: "$date", user: "$user" },
                tasksSum: { $sum: "$durationInMin" }
            }
        }
    ]

    var query = Task.aggregate(aggregateOpts)
    query.exec().then((tasks) => {

        res.status(200)
        return res.json({ data: tasks })
    }).catch(err => {

        res.status(err.status || 500)
        return res.json(err)
    })
})

module.exports = router