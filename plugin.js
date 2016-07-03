'use strict';

const myPlugin = {
    register: function (server, options, next) {
        server.route({
            method: ['GET', 'POST'],
            path: '/register',
            handler: function (request, reply) {
                var post = request.payload;

                var user = post.user;
                if (user !== 'max') {
                    next();
                    return;
                }

                reply('Ok man!');
            }
        });
    }
};

myPlugin.register.attributes = {
    name: 'myPlugin',
    version: '1.0.0'
};

module.exports = myPlugin;