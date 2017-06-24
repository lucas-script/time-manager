var express = require('express')
var router = express.Router()

var User = require('../models/user')

router.post('/', (req, res, next) => {

    var u = new User(req.body)

    u.save().then(function () {

        res.status(201)
        return res.json({ data: u })

    }).catch(function (err) {

        res.status(err.status || 500)
        return res.json(err)
    })
})

module.exports = router
