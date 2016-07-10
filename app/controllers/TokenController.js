'use strict';

let config = global.config;
let key = config.secret;

module.exports.getToken = {
    handler: function (request, reply) {
        var jwt = require('jsonwebtoken');
        var token = jwt.sign({
            id: 1,
            username: 'tutv95',
            session: 'sjdfkljsdlkfjsddjfklsdfj'
        }, key);
        reply({secret: token});
    },
    auth: false,
    description: 'Get Token',
    notes: 'Returns a todo item by the id passed in the path',
    tags: ['api', 'token']
};