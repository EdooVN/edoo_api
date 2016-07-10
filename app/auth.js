'use strict';

module.exports.register = function register(server, options, next) {
    let config = global.config;
    let key = config.secret;

    let validate = function (decoded, request, callback) {
        console.log(decoded);

        return callback(null, true);
    };

    server.register(require('hapi-auth-jwt2'), function (err) {
        if (err) {
            console.log(err);
            return;
        }

        server.auth.strategy('jwt', 'jwt',
            {
                key: key,
                validateFunc: validate,
                verifyOptions: {algorithms: ['HS256']}
            });
    });
};

module.exports.register.attributes = {
    name: 'Authentication',
    version: '1.0.0'
};