var express = require('express')
var router = express.Router()

router.get('/', (req, res, next) => {

  return res.json({ message: 'time-manager-api' })
})

module.exports = router
