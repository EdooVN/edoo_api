'use strict';
// https://www.youtube.com/watch?v=SFmf3pInKiU

let controller = require('./controllers/AllController');
module.exports.register = (plugin, options, next) => {

    plugin.route([
        // {
        //     method: ['GET', 'POST'],
        //     path: '/login',
        //     config: controller.user.loginPost
        // },
        {
            method: ['GET'],
            path: '/getToken',
            config: controller.token.getToken
        }
    ]);

    next();
};

module.exports.register.attributes = {
    name: 'api'
};