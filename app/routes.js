'use strict';

module.exports.register = (plugin, options, next) => {
    let controller = require('./controllers/AllController');

    plugin.route([
        {
            method: ['GET', 'POST'],
            path: '/login',
            config: controller.user.loginPost
        },
        {
            method: ['GET'],
            path: '/getToken',
            config: controller.token.getToken
        },
        {
            method: ['GET'],
            path: '/',
            config: controller.user.register
        }
    ]);
};

module.exports.register.attributes = {
    name: 'api'
};