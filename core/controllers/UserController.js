'use strict';

module.exports.loginPost = {
    handler: function (request, reply) {
        return reply({result: 'Hello hapi!'});
    },
    description: 'Register',
    notes: 'Returns a todo item by the id passed in the path',
    tags: ['api', 'register']
};