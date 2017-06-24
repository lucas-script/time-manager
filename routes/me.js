var express = require('express')
var router = express.Router()

var User = require('../models/user')

var loggedUser

router.use((req, res, next) => {
    loggedUser = req.tokenObj.user
    next()
})

router.get('/', (req, res, next) => {

    var q = User.findOne({ _id: loggedUser._id })
    q.select('_id name email password role workload workloadEnable')

    q.exec().then((u) => {

        res.status(200)
        return res.json({ data: u })

    }).catch((err) => {

        res.status(err.status || 500)
        return res.json(err)
    })
})

router.put('/', (req, res, next) => {

    var changePass = req.body.changePass
    var workloadEnable = req.body.workloadEnable

    if (!changePass) {
        delete (req.body.password)
    }

    var q = User.findOne({ _id: loggedUser._id })
    q.select('_id name email password role workload workloadEnable')

    q.exec().then((u) => {

        if (req.body.name) u.name = req.body.name
        if (req.body.email) u.email = req.body.email
        if (req.body.password) u.password = req.body.password
        if (req.body.workload) u.workload = req.body.workload
        u.workloadEnable = req.body.workloadEnable

        u.save().then(() => {

            res.status(200)
            return res.json({ data: u })

        }).catch((err) => { // save

            res.status(err.status || 500)
            return res.json(err)
        })

    }).catch((err) => { // exec

        res.status(err.status || 500)
        return res.json(err)
    })
})

module.exports = router
