var express = require('express');
var router = express.Router();

var User = require('../models/user');

var loggedUser;

// only managers and admins can acccess
router.use(function (req, res, next) {

    loggedUser = req.tokenObj.user;

    if (loggedUser.role === 'admin' || loggedUser.role === 'manager') {
        next();
    } else {
      res.status(401);
      return res.json({ message: 'Unauthorized' });
    }
});

router.get('/', function (req, res, next) {

    var q = User.find({});
    q.select('_id name email password role favoriteHours');

    q.exec().then(function (users) {

        res.status(200);
        return res.json({ data: users });

    }).catch(function (err) {

        res.status(err.status || 500);
        return res.json(err);
    });
});

route.get('/:id', function (req, res, next) {

    var id = req.params.id;
    var q = User.findOne({ _id: id });
    q.select('_id name email password role favoriteHours');

    q.exec().then(function (u) {

        res.status(200);
        return res.json({ data: u });

    }).catch(function (err) {

        res.status(err.status || 500);
        return res.json(err);
    });
});

router.post('/', function (req, res, next) {

    var u = new User(req.body);

    u.save().then(function () {

        res.status(201);
        return res.json({ data: u });

    }).catch(function (err) {

        res.status(err.status || 500);
        return res.json(err);
    });
});

router.put('/:id', function (req, res,next) {

    var q = User.findOne({ _id: id });
    q.select('_id name email password role favoriteHours');

    q.exec().then(function (u) {

        if (req.body.name) u.name = req.body.name;
        if (req.body.email) u.email = req.body.email;
        if (req.body.password) u.password = req.body.password;
        if (req.body.role) u.role = req.body.role;
        if (req.body.favoriteHours) u.favoriteHours = req.body.favoriteHours;

        u.save().then(function () {

            res.status(200);
            return res.json({ data: u });

        }).catch(function (err) { // save

            res.status(err.status || 500);
            return res.json(err);
        });
    }).catch(function (err) { // exec

        res.status(err.status || 500);
        return res.json(err);
    });
});

router.delete('/:id', function (req, res, next) {

    var id = req. params.id;
    var q = User.findOneAndRemove({ _id: id });

    q.exec().then(function (u) {

        res.status(200);
        return res.json({ message: 'Deleted' });

    }).catch(function (err) {

        res.status(err.status || 500);
        return res.json(err);
    });
});

module.exports = router;
