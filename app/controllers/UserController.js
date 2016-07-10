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
                reply('404');
                return;
            }

            user.generateSession().then(function (user_changed) {
                let user_ = user_changed.toJSON();
                delete user_.password;
                delete user_.session;
                user_.token = user_changed.getToken();
                reply(user_);
            });
        });
    },
    auth: false,
    description: 'Login',
    notes: 'Returns a todo item by the id passed in the path',
    tags: ['api', 'register']
};

module.exports.register = {
    handler: function (request, reply) {
        return reply({result: 'Register!'});
    },
    auth: {
        mode: 'required',
        strategies: ['jwt']
    },
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
                return reply(Boom.forbidden());
            }

            user.destroyToken().then(function (user_changed) {

                return reply({
                    error: false,
                    message: 'Logout success!'
                });
            });
        });
    },
    auth: {
        mode: 'required',
        strategies: ['jwt']
    },
    description: 'Register',
    notes: 'Returns a todo item by the id passed in the path',
    tags: ['api', 'register']
};