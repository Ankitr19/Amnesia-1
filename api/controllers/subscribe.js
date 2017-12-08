'use strict';
var mongoose = require('mongoose'),
    notify = require("../models/model"),
    cron = require('node-cron'),
    twilio = require('twilio'),
    config = require('../../config'),
    path = require('path'),
    fs = require("fs"),
    jsonfile = require('jsonfile'),
    time = require("time"),
    moment = require('moment-timezone');

var client = twilio(config.accountSid, config.authToken),
    SLEEP_TIME_24HRS = 22,
    WAKE_TIME_24HRS = 6,
    MAX_SEND_LIMIT = 5;

function toServerTimezone(moment_date, timezone) {
    return moment.tz(moment_date, timezone);
}

function userIsSleep(user) {
    var user_time_zone = user.timeZone,
        user_current_time = toServerTimezone(moment().format(), user_time_zone);

    var user_current_hour = user_current_time.hours();
    console.log(user_current_hour);

    if (user_current_hour >= SLEEP_TIME_24HRS && user_current_hour <= 24)
        return true;
    else if (user_current_hour >= 0 && user_current_hour <= WAKE_TIME_24HRS)
        return true;
    else
        return false;
}

function startNotify(user) {
    var user_time_zone = user.timeZone,
        user_current_time = toServerTimezone(moment().format(), user_time_zone),
        server_current_time = moment();

    var user_current_hour = user_current_time.hours(),
        server_current_hour = server_current_time.hours();

    if (Math.abs(server_current_hour - user_current_hour) >= 1)
        return true;
    return false;
}


function messageSentSuccess(data, options) {
    var masked = options.to.substr(0, options.to.length - 5);
    masked += '*****';
    console.log('Message sent to ' + masked);
    console.log(data.sid);
}

function messageSentFailed(err) {
    var file = path.join(__dirname, '../logs', 'logs.json');
    var obj = {
        "twilio_error": err,
        "data": (moment().format()).toString()
    }
     
    jsonfile.writeFile(file, obj, {flag: 'a'}, function (json_err) {
        if (json_err)
            console.error(json_err);
    })

    // console.error(err);
    console.log('Log Saved!');
}

function twilioAPI(count, options) {
    if (count < MAX_SEND_LIMIT) {
        count += 1;
        return client.messages
            .create({
                to: options.to,
                from: '+14153600591',
                body: options.body,
            }).then(function (data) {
                messageSentSuccess(data, options);
                return data;
            }).catch(function (err) {
                messageSentFailed(err);
                return twilioAPI(count, options);
            });
    } else {
        throw new Error('Exceeded maximum number of retries');
    }
}

function connectWithAPI(options) {
    var count = 0;
    twilioAPI(count = 0, options)
        .then(function (data){
            console.log("Text Send - Promise Success");
        }).catch(function (err) {
            console.log("Text Not Send - Promise Failed");            
        });
}

function sendMessages(user) {
    var options = {
        to: user.phone,
        from: config.twilioNumber,
        body: user.message
    };
    connectWithAPI(options);
}

function watchJobs(user) {
    cron.schedule('0 */1 * * *', function(){
        console.log("--------------");
        console.log('Running a Watch After Every Hour');
        console.log(user.phone);


        if (!userIsSleep(user)) {
            console.log("User Not Sleep");
            sendMessages(user);
        }    

        console.log(moment().format());
        console.log("--------------");

    });
}

function createJobsForEachUser(users) {
    users.forEach(function (user) {
        // console.log(user.phone);
        watchJobs(user);
    });
}

var jobs = function () {
    notify.find({}, function (err, users) {
        if (err)
            console.log(err);
        // console.log(users);
        createJobsForEachUser(users);
    });
}

var addNewWatch = function (user) {
    watchJobs(user);
    console.log("New User ----- " + user.phone);
}

module.exports = {
    jobs,
    addNewWatch
};