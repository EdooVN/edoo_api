'use strict';
const Joi = require('joi');
const _ = require('lodash');
const Boom = require('boom');

const myPlugin = {
    register: function (server, options, next) {
        server.route({
            method: ['POST'],
            path: '/register',
            config: {
                auth: 'fries',
                handler: function (request, reply) {
                    console.log(request.auth.credentials.user);

                    reply(Boom.notFound('missing'));
                },
                validate: {
                    payload: {
                        username: Joi.string().min(3).max(10)
                    }
                },
                description: 'Register',
                notes: 'Returns a todo item by the id passed in the path',
                tags: ['api', 'register']
            }
        });

        server.route({
            method: ['POST'],
            path: '/login',
            handler: function (request, reply) {
                var post = request.payload;

                reply(request.params);

            },
            config: {
                validate: {
                    payload: {
                        name: Joi.string().min(3).max(10),
                        username: Joi.string().min(3).max(10),
                        email: Joi.string().min(3).max(10),
                    }
                },
                description: 'Login',
                notes: 'Returns a todo item by the id passed in the path',
                tags: ['api']
            }
        });
    }
};

myPlugin.register.attributes = {
    name: 'myPlugin',
    version: '1.0.0'
};

module.exports = myPlugin;