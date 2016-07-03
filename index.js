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

const scheme = function (server, options) {
    return {
        api: {
            settings: {
                x: 5
            }
        },
        authenticate: function (request, reply) {

            const req = request.raw.req;
            const authorization = req.headers.authorization;
            if (!authorization) {
                return reply(Boom.unauthorized(null, 'Custom'));
            }

            return reply.continue({credentials: {user: 'john'}});
        }
    };
};

server.auth.scheme('custom', scheme);
server.auth.strategy('default', 'custom');

console.log(server.auth.api.default.settings.x);    // 5