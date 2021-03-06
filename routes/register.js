var express = require('express')
var router = express.Router()

var User = require('../models/user')

router.post('/', (req, res, next) => {

    // block admin/manager by post
    delete(req.body.role)

    var user = new User(req.body)

    user.save().then(function () {

        res.status(201)
        return res.json({ data: user })

    }).catch(function (err) {

        res.status(err.status || 500)
        return res.json(err)
    })
})

module.exports = router
