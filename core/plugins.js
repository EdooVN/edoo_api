'use strict';

const Inert = require('inert');
const Vision = require('vision');
const HapiSwagger = require('hapi-swagger');
const FAuth = require('./auth');
const Route = require('./route');

module.exports = [
    Inert,
    Vision,
    {
        register: HapiSwagger,
        options: {
            info: {
                'title': 'API Documentation',
                'version': '1.0.0'
            }
        }
    },
    Route
    // FAuth
];