var express = require('express')
var router = express.Router()

var Task = require('../models/task')

var loggedUser

// only regular users and admins can access
router.use((req, res, next) => {

    loggedUser = req.tokenObj.user

    if (loggedUser.role === 'admin' || loggedUser.role === 'regular') {
        next()
    } else {
        res.status(401)
        return res.json({ message: 'Unauthorized' })
    }
})

router.get('/', (req, res, next) => {

    var query

    // access control
    // admin
    if (loggedUser.role === 'admin') {
        query = Task.find({})
    } else { // regular
        query = Task.find({ user: loggedUser._id })
    }

    query.populate('user')
    query.select('_id name date durationInMin user')

    // start date
    let sdate = req.query.sdate
    // end date
    let edate = req.query.edate

    // filter start date and end date
    if (sdate && edate) {
        query.where('date').gte(sdate).lte(edate)
    }

    // filter only start date
    if (sdate && !edate) {
        query.where('date').gte(sdate)
    }

    // filter only end date
    if (!sdate && edate) {
        query.where('date').lte(edt)
    }

    query.exec().then((tasks) => {

        if (!tasks) {
            res.status(403)
            return res.json({ message: 'Forbidden' })
        }

        res.status(200)
        return res.json({ data: tasks })

    }).catch((err) => {

        res.status(err.status || 500)
        return res.json(err)
    })
})

router.get('/:id', (req, res, next) => {

    var query
    var id = req.params.id

    // access control
    // admin
    if (loggedUser.role === 'admin') {
        query = Task.findOne({ _id: id })
    } else { // regular
        query = Task.findOne({ _id: id, user: loggedUser._id })
    }

    query.select('_id name date durationInMin user')
    
    query.exec().then((task) => {

        if (!task) {
            res.status(403)
            return res.json({ message: 'Forbidden' })
        }

        res.status(200)
        return res.json({ data: task })

    }).catch((err) => {

        res.status(err.status || 500)
        return res.json(err)
    })
})

router.post('/', (req, res, next) => {

    var task = new Task(req.body)
    task.user = loggedUser._id

    task.save().then(() => {

        res.status(201)
        return res.json({ data: task })

    }).catch((err) => {

        res.status(err.status || 500)
        return res.json(err)
    })
})

router.put('/:id', (req, res, next) => {

    var query
    var id = req.params.id

    // access control
    // admin
    if (loggedUser.role === 'admin') {
        query = Task.findOne({ _id: id })
    } else { // regular
        query = Task.findOne({ _id: id, user: loggedUser._id })
    }

    query.select('_id name date durationInMin user')
    
    query.exec().then((task) => {

        if (!task) {
            res.status(403)
            return res.json({ message: 'Forbidden' })
        }

        if (req.body.name) task.name = req.body.name
        if (req.body.date) task.date = req.body.date
        if (req.body.durationInMin) task.durationInMin = req.body.durationInMin

        task.save().then(() => {

            res.status(200)
            return res.json({ data: task })

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

    var query
    var id = req.params.id

    // access control
    // admin
    if (loggedUser.role === 'admin') {
        query = Task.findOneAndRemove({ _id: id })
    } else { // regular
        query = Task.findOneAndRemove({ _id: id, user: loggedUser._id })
    }

    query.exec().then((task) => {

        if (!task) {
            res.status(403)
            return res.json({ message: 'Forbidden' })
        }

        res.status(200)
        return res.json({ message: 'Deleted' })

    }).catch((err) => {

        res.status(err.status || 500)
        return res.json(err)
    })
})

module.exports = router
