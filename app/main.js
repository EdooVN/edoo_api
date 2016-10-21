'use strict';

const Hapi = require('hapi');
const _ = require('lodash');
const helpers = global.helpers;
const config = helpers.config;

/**
 * Create server.
 */
const server = new Hapi.Server();
server.connection({
    port: config('SERVER_PORT', 6789),
    host: config('SERVER_ADDRESS', 'localhost')
});

/**
 * set header for each reply
 */
server.ext('onPreResponse', function (request, reply) {
    if (!request.response.isBoom) {
        request.response.header('Access-Control-Allow-Origin', '*');
        request.response.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    } else {
        request.response.output.headers['Access-Control-Allow-Origin'] = '*';
        request.response.output.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
    }

    reply.continue();
});

_register_plugins();

/**
 * Start server.
 */
server.start((err) => {
    if (err) {
        console.error(err);
    }

    // after server started
    _register_route_plugin();

    console.log('Server running at:', server.info.uri);
});


/**
 * Register plugins.
 */
function _register_plugins() {
    var plugins = require('./plugins');

    if (!_.isArray(plugins)) {
        return;
    }

    server.register(plugins, (err) => {
        if (err) {
            console.log('Fail to load plugins.');
            console.error(err);
        }
    });
}

/**
 * Server started.
 */
function _register_route_plugin() {
    let route = require('./plugins/routes');

    server.register([route], (err) => {
        if (err) {
            console.log('Fail to load plugins.');
            console.error(err);
        }
    });
}