'use strict';

const Hapi = require('hapi');
const myPlugin = require('./plugin');

const server = new Hapi.Server();
server.connection({port: 6789});

server.start((err) => {
    if (err) {
        console.error(err);
    }

    __server_start();

    console.log('Server running at:', server.info.uri);
});

function __server_start() {
    server.register({
        register: myPlugin
    }, (err) => {
        if (err) {
            console.log('Fail to load plugin.');
        }
    });
}