'use strict';

/***
 * Login post
 */
module.exports.loginPost = {
    handler: function (request, reply) {
        return reply({result: 'Hello hapi!'});
    },
    auth: {
        strategies: ['jwt'],
        mode: 'required'
    },
    description: 'Register',
    notes: 'Returns a todo item by the id passed in the path',
    tags: ['api', 'register']
};

module.exports.register = {
    handler: function (request, reply) {
        return reply({result: 'Register!'});
    },
    auth: false,
    description: 'Register',
    notes: 'Returns a todo item by the id passed in the path',
    tags: ['api', 'register']
};