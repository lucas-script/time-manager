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

    var query = User.find({})
    query.select('_id name email password role workload workloadEnable')

    query.exec().then((users) => {

        res.status(200)
        return res.json({ data: users })

    }).catch((err) => {

        res.status(err.status || 500)
        return res.json(err)
    })
})

router.get('/:id', (req, res, next) => {

    var id = req.params.id
    var query = User.findOne({ _id: id })
    query.select('_id name email role workload workloadEnable')

    query.exec().then((user) => {

        res.status(200)
        return res.json({ data: user })

    }).catch((err) => {

        res.status(err.status || 500)
        return res.json(err)
    })
})

router.post('/', (req, res, next) => {

    var user = new User(req.body)

    user.save().then(() => {

        res.status(201)
        return res.json({ data: user })

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

    var query = User.findOne({ _id: id })
    query.select('_id name email password role workload workloadEnable')

    query.exec().then((user) => {

        if (req.body.name) user.name = req.body.name
        if (req.body.email) user.email = req.body.email
        if (req.body.password) user.password = req.body.password
        if (req.body.role) user.role = req.body.role
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

router.delete('/:id', (req, res, next) => {

    var id = req. params.id
    var query = User.findOneAndRemove({ _id: id })

    query.exec().then((user) => {

        res.status(200)
        return res.json({ message: 'Deleted' })

    }).catch((err) => {

        res.status(err.status || 500)
        return res.json(err)
    })
})

module.exports = router
