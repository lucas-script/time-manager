var express = require('express')
var router = express.Router()
var jwt = require('jsonwebtoken')
var config = require('../config')

var User = require('../models/user')

router.post('/', function (req, res, next) {

    var email = req.body.email
    var pass = req.body.password

    var q = User.findOne({ email: email })
    q.exec().then(function (u) {

        if (!u) {
            res.status(401)
            return res.json({ message: 'User not found' })
        }

        var isCorrectPass = u.checkPassword(pass)
        if (!isCorrectPass) {
            res.status(401)
            return res.json({ message: 'Wrong password' })
        }

        // token
        var t = jwt.sign({ user: u }, config.secret, { expiresIn:'12h' })

        res.status(200)
        return res.json({ token: t, name: u.name, email: u.email })

    }).catch(function (err) {

        res.status(err.status || 500)
        return res.json(err)
    })
})

router.post('/isTokenValid', function (req, res, next) {

    var token = req.body.token
    jwt.verify(token, s, function (err, d) {
        if (err) {

            res.status(200)
            return res.json({ valid: false })
        } else {

            res.status(200)
            return res.json({ valid: true })
        }

    })
})

module.exports = router
