'use strict';

module.exports.register = (plugin, options, next) => {
    let controller = require('./controllers/AllController');

    plugin.route([
        {
            method: ['POST'],
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
            path: '/token',
            config: controller.user.register
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