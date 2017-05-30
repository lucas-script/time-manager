var express = require('express');
var router = express.Router();

var Task = require('../models/task');

var loggedUser;

// only regular users and admins can access
router.use(function (req, res, next) {

    loggedUser = req.tokenObj.user;

    if (loggedUser.role === 'admin' || loggedUser.role === 'regular') {
        next();
    } else {
        res.status(401);
        return res.json({ message: 'Unauthorized' });
    }
});

router.get('/', function (req, res, next) {

    var q;

    // access control
    // admin
    if (loggedUser.role === 'admin') {
        q = Task.find({});
    } else { // regular
        q = Task.find({ user: loggedUser._id });
    }

    q.select('_id name date durationInMin user');

    q.exec().then(function (tasks) {

        res.status(200);
        return res.json({ data: tasks });

    }).catch(function (err) {

        res.status(err.status || 500);
        return res.json(err);
    });
});

router.get('/:id', function (req, res, next) {

    var q;
    var id = req.params.id;

    // access control
    // admin
    if (loggedUser.role === 'admin') {
        q = Task.findOne({ _id: id });
    } else { // regular
        q = Task.findOne({ _id: id, user: loggedUser._id });
    }

    q.select('_id name date durationInMin user');
    
    q.exec().then(function (t) {

        res.status(200);
        return res.json({ data: t });

    }).catch(function (err) {

        res.status(err.status || 500);
        return res.json(err);
    });
});

router.post('/', function (req, res, next) {

    var t = new Task(req.body);
    t.user = loggedUser._id;

    t.save().then(function () {

        res.status(201);
        return res.json({ data: { _id: t._id }});

    }).catch(function (err) {

        res.status(err.status || 500);
        return res.json(err);
    });
});

// force error to test the catches
router.put('/:id', function (req, res, next) {

    var q;
    var id = req.params.id;

    // access control
    // admin
    if (loggedUser.role === 'admin') {
        q = Task.findOne({ _id: id });
    } else { // regular
        q = Task.findOne({ _id: id, user: loggedUser._id });
    }

    q.select('_id name date durationInMin user');
    
    q.exec().then(function (t) {
        if (req.body.name) t.name = req.body.name;
        if (req.body.date) t.date = req.body.date;
        if (req.body.durationInMin) t.durationInMin = req.body.durationInMin;

        t.save().then(function () {

            res.status(200);
            return res.json({ data: { _id: t._id }});

        }).catch(function (err) {

            res.status(err.status || 500);
            return res.json(err);
        });
    });
});

router.delete('/:id', function (req, res, next) {

    var q;
    var id = req.params.id;

    // access control
    // admin
    if (loggedUser.role === 'admin') {
        q = Task.remove({ _id: id });
    } else { // regular
        q = Task.remove({ _id: id, user: loggedUser._id });
    }

    q.exec().then(function (t) {

        res.status(200);
        return res.json({ _id: t._id });

    }).catch(function (err) {

        res.status(err.status || 500);
        return res.json(err);
    });
});

module.exports = router;
