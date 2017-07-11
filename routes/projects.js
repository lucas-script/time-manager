var express = require('express')
var router = express.Router()

var Project = require('../models/project')

router.get('/', (req, res, next) => {

    var query = Project.find({})

    query.exec().then((projects) => {

        if (!projects) {
            res.status(403)
            return res.json({ message: 'Forbidden' })
        }

        res.status(200)
        return res.json({ data: projects })
    }).catch((err) => {

        res.status(err.status || 500)
        return res.json(err)
    })
})

router.post('/', (req, res, next) => {

    var project = new Project(req.body)

    project.save().then(() => {

        res.status(201)
        return res.json({ data: project })
    }).catch((err) => {

        res.status(err.status || 500)
        return res.json(err)
    })
})

module.exports = router
