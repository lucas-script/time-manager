var express = require('express')
var router = express.Router()
var jwt = require('jsonwebtoken')
var config = require('../config')

var User = require('../models/user')

router.post('/', (req, res, next) => {

    var email = req.body.email
    var pass = req.body.password

    var query = User.findOne({ email: email })
    query.exec().then((user) => {

        if (!user) {
            res.status(401)
            return res.json({ message: 'User not found' })
        }

        var isCorrectPass = user.checkPassword(pass)
        if (!isCorrectPass) {
            res.status(401)
            return res.json({ message: 'Wrong password' })
        }

        var token = jwt.sign({ user: user }, config.secret, { expiresIn:'12h' })

        res.status(200)
        return res.json({ token: token, name: user.name, email: user.email, role: user.role })

    }).catch((err) => {

        res.status(err.status || 500)
        return res.json(err)
    })
})

router.post('/isTokenValid', (req, res, next) => {

    var token = req.body.token
    jwt.verify(token, config.secret, (err, decoded) => {
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
