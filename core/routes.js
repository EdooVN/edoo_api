'use strict';
// https://www.youtube.com/watch?v=SFmf3pInKiU

let controller = require('./controllers/AllController');
module.exports.register = (plugin, options, next) => {

    plugin.route([
        {
            method: ['GET'],
            path: '/register',
            config: controller.user.loginPost

            // auth: false,
            // handler: controller.user.loginPost,
            // description: 'Register',
            // notes: 'Returns a todo item by the id passed in the path',
            // tags: ['api', 'register']
            // }
        }
    ]);

    next();
};

module.exports.register.attributes = {
    name: 'api'
};