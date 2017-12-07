'use strict';
var mongoose = require('mongoose'),
    time = require("time"),
    moment = require('moment-timezone'),
    twilio = require('twilio'),
    config = require('../../config'),
    Schema = mongoose.Schema;

var notifySchema = new Schema({
    phone: {
        type: String,
        required: 'Enter the phone number for notification purposes',
        unique: true
    },
    register_date: {
        type: Date,
        default: moment()
    },
    timeZone: {
        type: String,
        required: true
    },
    message: {
        type: String,
        default: "Hello From Database"
    }
});

module.exports = mongoose.model('notify', notifySchema);