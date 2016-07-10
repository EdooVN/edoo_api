'use strict';

global.helpers = require('./helpers/helpers');

const Hapi = require('hapi');
const _ = require('lodash');
const config = global.config;

const server = new Hapi.Server();
server.connection({
    port: config.port,
    host: config.host
});

_register_plugins();

/**
 * Start server
 */
server.start((err) => {
    if (err) {
        console.error(err);
    }

    server_started();

    console.log('Server running at:', server.info.uri);
});


/**
 * Register plugins
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
 * Server started
 */
function server_started() {
    let route = require('./plugins/routes');

    server.register([route], (err) => {
        if (err) {
            console.log('Fail to load plugins.');
            console.error(err);
        }
    });
}