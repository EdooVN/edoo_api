'use strict';

const Hapi = require('hapi');

const server = new Hapi.Server();
server.connection({port: 6789});

const myPlugin = {
    register: function (server, options, next) {
        server.route({
            method: 'GET',
            path: '/abc',
            handler: function (request, reply) {
                reply('Ok man!');
            }
        });
    }
};

myPlugin.register.attributes = {
    name: 'myPlugin',
    version: '1.0.0'
};

server.start((err) => {
    if (err) {
        console.error(err);
    }

    server.register({
        register: myPlugin
    }, (err) => {
        if (err) {
            console.log('Fail to load plugin.');
        }
    });
    
    console.log('Server running at:', server.info.uri);
});