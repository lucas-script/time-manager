var express = require('express')

var User = require('../models/user')
var Task = require('../models/task')

const router = express.Router()

router.get('/', (req, res, next) => {
    next();
})

module.exports = router