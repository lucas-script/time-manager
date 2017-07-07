var express = require('express')
var router = express.Router()

var User = require('../models/user')

var loggedUser

router.use((req, res, next) => {
    loggedUser = req.tokenObj.user
    next()
})

router.get('/', (req, res, next) => {

    var query = User.findOne({ _id: loggedUser._id })
    query.select('_id name email password role workload workloadEnable')

    query.exec().then((user) => {

        res.status(200)
        return res.json({ data: user })

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

    var query = User.findOne({ _id: loggedUser._id })
    query.select('_id name email password role workload workloadEnable')

    query.exec().then((user) => {

        if (req.body.name) user.name = req.body.name
        if (req.body.email) user.email = req.body.email
        if (req.body.password) user.password = req.body.password
        if (req.body.workload) user.workload = req.body.workload
        user.workloadEnable = req.body.workloadEnable

        user.save().then(() => {

            res.status(200)
            return res.json({ data: user })

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
