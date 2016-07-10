'use strict';

module.exports.register = (server, options, next) => {
    let controller = require('./../controllers/AllController');

    server.route([
        {
            method: ['POST'],
            path: '/login',
            config: controller.user.loginPost
        },
        {
            method: ['POST'],
            path: '/register',
            config: controller.user.registerPost
        },
        {
            method: ['GET'],
            path: '/logout',
            config: controller.user.logout
        }
    ]);
};

module.exports.register.attributes = {
    name: 'api'
};