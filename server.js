var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require('mongoose'),
    path = require("path"),
    notify = require('./api/models/model'),
    time = require("time"),
    moment = require('moment-timezone'),
    subscribe = require("./api/controllers/subscribe");

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/sms-serv-db', { useMongoClient: true }, function() {
    // mongoose.connection.db.dropDatabase();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

var routes = require("./api/routes/routes.js")(app);

var server = app.listen(3000, function () {
    console.log("Listening on port %s...", server.address().port);
}); 

subscribe.jobs();
