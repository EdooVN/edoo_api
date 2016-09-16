'use strict';

const _ = require('lodash');
const Models = global.Models;
const jwt = require('hapi-auth-jwt2');

module.exports.register = function register(server, options, next) {
    let config = global.helpers.config;
    let key = config('SERVER_KEY', '');

    let validate = function (decoded, request, callback) {
        if (!_.has(decoded, 'id')) {
            return callback(null, false);
        }

        request.auth.credentials = decoded;

        // console.log('decoder' + decoded);

        let tokenId = _.get(decoded, 'token_id', '');
        new Models.Token({
            id : tokenId
        }).fetch().then(function (token) {
            let timeExpire = token.toJSON().time_expire;
            if (Date.now() > timeExpire){
                callback(null, false);
            } else {
                return callback(null, true);
            }
        }).catch(function () {
            callback(null, false);
        });
    };

    server.register(jwt, function (err) {
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