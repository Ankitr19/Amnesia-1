'use strict';
var path = require('path'),
    mongoose = require('mongoose'),
    notify = mongoose.model('notify'),
    subscribe = require("./subscribe");

exports.home = function (req, res) {
    res.status(200);
    res.sendFile(path.join(__dirname, '../../public', 'index.html'));
};

exports.allUser = function (req, res) {
    notify.find({}, function (err, task) {
        if (err)
            res.send(err);
        res.json(task);
    });
};

function userExists(user) {
    Task.findById(user.phone, function (err, task) {
        if (err)
            return false;
        return true;
    });
};

exports.newUser = function (req, res) {
    var new_notify = new notify(req.body);
    new_notify.save(function (err, task) {
        if (err)
            res.send(err);
        subscribe.addNewWatch(task);
        res.json(task);
    });
};