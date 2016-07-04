'use strict';

const Hapi = require('hapi');
const Inert = require('inert');
const Vision = require('vision');
const HapiSwagger = require('hapi-swagger');
const Joi = require('joi');
const myPlugin = require('./plugin');
const _ = require('lodash');

const server = new Hapi.Server();
server.connection({
    host: 'localhost',
    port: 3000
});

const options = {
    info: {
        'title': 'Test ACD Documentation',
        'version': '1.0.0'
    }
};

server.register([
    Inert,
    Vision,
    {
        'register': HapiSwagger,
        'options': options
    }
], (err) => {
    server.start((err) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Server running at:', server.info.uri);
        }
    });
});

server.route({
    method: 'GET',
    path: '/todo/{id}/',
    config: {
        handler: function (req, rep) {
            rep('abc');
        },
        description: 'Get todo',
        notes: 'Returns a todo item by the id passed in the path',
        tags: ['api'],
        validate: {
            params: {
                id: Joi.number()
                    .required()
                    .description('the id for the todo item'),
            }
        }
    }
});

const scheme_fries = function (server, options) {
    return {
        authenticate: function (request, reply) {
            const post = request.payload;
            var username = _.get(post, 'username', 'abd');
            console.log(post);

            return reply.continue({credentials: {user: 'john'}});
        }
    };
};

server.auth.scheme('fries', scheme_fries);
server.auth.strategy('fries', 'fries');

server.register([
    {
        register: myPlugin
    }
], (err) => {
    if (err) {
        console.log('Fail to load plugin.');
    }
});
