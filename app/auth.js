'use strict';

const _ = require('lodash');

module.exports.register = function register(server, options, next) {
    let config = global.config;
    let key = config.secret;

    let validate = function (decoded, request, callback) {
        if (!_.has(decoded, 'id')) {
            return callback(null, false);
        }

        request.auth.credentials = decoded;

        return callback(null, true);
    };

    server.register(require('hapi-auth-jwt2'), function (err) {
        if (err) {
            return console.log(err);
        }

        server.auth.strategy('jwt', 'jwt', {
            key: key,
            validateFunc: validate,
            verifyOptions: {algorithms: ['HS256']}
        });
    });
};

module.exports.register.attributes = {
    name: 'Fries Authentication',
    version: '1.0.0'
};