'use strict';
// https://www.youtube.com/watch?v=SFmf3pInKiU

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
        }
    ]);
};

module.exports.register.attributes = {
    name: 'api'
};