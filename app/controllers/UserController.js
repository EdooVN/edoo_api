'use strict';

const _ = require('lodash');
const Boom = require('boom');
const Model = global.Model;

/***
 * Login post
 */
module.exports.loginPost = {
    handler: function (request, reply) {
        let post = request.payload;
        let email = post.email;
        let password = post.password;

        new Model.User({
            email: email
        }).fetch().then(function (user) {
            if (password != user.get('password')) {
                return reply(Boom.unauthorized('Invalid password!'));
            }

            user.generateSession().then(function (user_changed) {
                reply({
                    error: false,
                    msg: 'Login success!',
                    token: user_changed.getToken()
                });
            });
        });
    },
    auth: false,
    description: 'Login',
    notes: 'Returns a todo item by the id passed in the path',
    tags: ['api', 'register']
};

module.exports.registerPost = {
    handler: function (request, reply) {
        return reply({result: 'Register!'});
    },
    auth: false,
    description: 'Register',
    notes: 'Returns a todo item by the id passed in the path',
    tags: ['api', 'register']
};

module.exports.logout = {
    handler: function (request, reply) {
        let user_data = request.auth.credentials;
        let _id = _.get(user_data, 'id', '');
        let _session = _.get(user_data, 'session', '');

        new Model.User({
            id: _id
        }).fetch().then(function (user) {
            if (_session != user.get('session')) {
                return reply(Boom.badRequest('Some thing went wrong!'));
            }

            user.destroyToken().then(function (user_changed) {

                return reply({
                    error: false,
                    msg: 'Logout success!'
                });
            });
        });
    },
    auth: {
        mode: 'required',
        strategies: ['jwt']
    },
    description: 'Logout',
    notes: 'Logout',
    tags: ['api', 'logout']
};