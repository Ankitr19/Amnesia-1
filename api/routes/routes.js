'use strict';
module.exports = function (app) {
  var controller = require('../controllers/controller');

  app.route('/')
    .get(controller.home);

  app.route('/allUser/')
    .get(controller.allUser);

  app.route('/newUser/')
    .get(controller.allUser)
    .post(controller.newUser);
};