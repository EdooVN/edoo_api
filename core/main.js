/**
 * Created by max on 04/7/2016.
 */

'use strict';

const Hapi = require('hapi');

const server = new Hapi.Server();
server.connection({port: 6789});

/**
 * Start server
 */
server.start((err) => {
    if (err) {
        console.error(err);
    }

    _server_started();

    console.log('Server running at:', server.info.uri);
});

/**
 * Register plugins
 * @private
 */
function _server_started() {

}