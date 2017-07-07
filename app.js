var express = require('express')
var path = require('path')
var favicon = require('serve-favicon')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var jwt = require('jsonwebtoken')
var mongoose = require('mongoose')
var cors = require('cors')

var config = require('./config')

var index = require('./routes/index')
var register = require('./routes/register')
var auth = require('./routes/auth')
var tasks = require('./routes/tasks')
var users = require('./routes/users')
var workloads = require('./routes/workloads')
var me = require('./routes/me')
var reports = require('./routes/reports')

var app = express()

// connecting to database
mongoose.connect(config.dataBaseUrl)

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// cors
app.use(cors());

// non authenticated routes
app.use('/', index)
app.use('/api/v1/register', register)
app.use('/api/v1/auth', auth)

// routes authentication
app.use((req, res, next) => {

    // access the token from query, body, header or cookie
    var token = req.query.token || req.body.token || req.headers['token'] || req.cookies.token
    // secret
    var secret = config.secret
    // if there is an token
    if (token) {
        // verify the token
        jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                res.status(err.status || 500)
                return res.json(err)
            }
            // decoded token object
            req.tokenObj = decoded
            next()
        })
    } else {
        res.status(403)
        return res.json({ message: 'Token not found in the request' })
    }
})

// autheticated routes
app.use('/api/v1/tasks', tasks)
app.use('/api/v1/users', users)
app.use('/api/v1/workloads', workloads)
app.use('/api/v1/me', me)
app.use('/api/v1/reports', reports)

// catch 404 and forward to error handler
app.use((req, res, next) => {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.json(err)
})

module.exports = app
