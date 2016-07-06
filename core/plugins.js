'use strict';

const Inert = require('inert');
const Vision = require('vision');
const HapiSwagger = require('hapi-swagger');
const Auth = require('./auth');

module.exports = [
    Inert,
    Vision,
    // Auth,
    {
        register: HapiSwagger,
        options: {
            info: {
                'title': 'API Documentation',
                'version': '1.0.0'
            }
        }
    }
];