var express = require('express')
var router = express.Router()

/* GET home page. */
router.get('/', (req, res, next) => {
  res.json({ message: 'time-manager-api' })
})

module.exports = router
