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

    var q

    if (loggedUser.role === 'admin') {
        // admin user
        q = User.find({ workloadEnable: true })
    } else {
        // regular user
        q = User.find({ _id: loggedUser._id, workloadEnable: true })
    }

    q.select('_id workload')

    q.exec().then((workloads) => {

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

    var q = Task.aggregate(aggregateOpts)
    q.exec().then(ts => {

        res.status(200)
        return res.json({ data: ts })
    }).catch(err => {

        res.status(err.status || 500)
        return res.json(err)
    })
})

module.exports = router