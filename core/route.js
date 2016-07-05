'use strict';

module.exports.register = (plugin, options, next) => {

    plugin.route([
        {
            method: ['GET'],
            path: '/register',
            config: {
                auth: false,
                handler: function (request, reply) {
                    reply({a:'missing'});
                },
                description: 'Register',
                notes: 'Returns a todo item by the id passed in the path',
                tags: ['api', 'register']
            }
        }
    ]);

    next();
};

module.exports.register.attributes = {
    name: 'api'
};