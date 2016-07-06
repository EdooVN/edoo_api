'use strict';

const Hapi = require('hapi');
const _ = require('lodash');
var config = global.config;

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

    console.log('Server running at:', server.info.uri);
});

server_started();

/**
 * Register plugins
 * @private
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

function server_started() {
    let route = require('./routes');

    server.register([route], (err) => {
        if (err) {
            console.log('Fail to load plugins.');
            console.error(err);
        }
    });
}