var express = require('express')
var router = express.Router()

var User = require('../models/user')

var loggedUser

// only managers and admins can acccess
router.use((req, res, next) => {

    loggedUser = req.tokenObj.user

    if (loggedUser.role === 'admin' || loggedUser.role === 'manager') {
        next()
    } else {
      res.status(401)
      return res.json({ message: 'Unauthorized' })
    }
})

router.get('/', (req, res, next) => {

    var q = User.find({})
    q.select('_id name email password role workload workloadEnable')

    q.exec().then((users) => {

        res.status(200)
        return res.json({ data: users })

    }).catch((err) => {

        res.status(err.status || 500)
        return res.json(err)
    })
})

router.get('/:id', (req, res, next) => {

    var id = req.params.id
    var q = User.findOne({ _id: id })
    q.select('_id name email role workload workloadEnable')

    q.exec().then((u) => {

        res.status(200)
        return res.json({ data: u })

    }).catch((err) => {

        res.status(err.status || 500)
        return res.json(err)
    })
})

router.post('/', (req, res, next) => {

    var u = new User(req.body)

    u.save().then(() => {

        res.status(201)
        return res.json({ data: u })

    }).catch((err) => {

        res.status(err.status || 500)
        return res.json(err)
    })
})

router.put('/:id', (req, res, next) => {

    var id = req.params.id
    var changePass = req.body.changePass

    if (!changePass) {
        delete (req.body.password)
    }

    var q = User.findOne({ _id: id })
    q.select('_id name email password role workload workloadEnable')

    q.exec().then((u) => {

        if (req.body.name) u.name = req.body.name
        if (req.body.email) u.email = req.body.email
        if (req.body.password) u.password = req.body.password
        if (req.body.role) u.role = req.body.role
        if (req.body.workload) u.workload = req.body.workload
        if (req.body.workloadEnable) u.workloadEnable = req.body.workloadEnable

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

router.delete('/:id', (req, res, next) => {

    var id = req. params.id
    var q = User.findOneAndRemove({ _id: id })

    q.exec().then((u) => {

        res.status(200)
        return res.json({ message: 'Deleted' })

    }).catch((err) => {

        res.status(err.status || 500)
        return res.json(err)
    })
})

module.exports = router
