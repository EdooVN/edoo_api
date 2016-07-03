'use strict';
const Joi = require('joi');

const myPlugin = {
    register: function (server, options, next) {
        server.route({
            method: ['POST'],
            path: '/register',
            handler: function (request, reply) {
                var post = request.payload;

                reply(request.query);

            },
            config: {
                validate: {
                    payload: {
                        name: Joi.string().min(3).max(10)
                    }
                }
            }
        });
    }
};

myPlugin.register.attributes = {
    name: 'myPlugin',
    version: '1.0.0'
};

module.exports = myPlugin;