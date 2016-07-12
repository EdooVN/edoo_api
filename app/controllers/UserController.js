'use strict';

const _ = require('lodash');
const Boom = require('boom');
const Model = global.Model;
const bcrypt = require('bcrypt');
const Joi = require('joi');
const ResponseJSON = global.helpers.ResponseJSON;

/***
 * Login POST
 */
module.exports.loginPost = {
    handler: function (request, reply) {
        const post = request.payload;
        let email = _.get(post, 'email', '');
        let password = _.get(post, 'password', '');

        new Model.User({
            email: email
        }).fetch().then(function (user) {
            if (_.isEmpty(user)) {//Email doesn't exist
                return reply(Boom.unauthorized('Email doesn\'t exist!'));
            }

            bcrypt.compare(password, user.get('password'), function (err, res) {
                if (!res) {//Password invalid
                    return reply(Boom.unauthorized('Invalid password!'));
                }

                // Password valid
                user.generateSession().then(function (user_changed) {
                    reply(ResponseJSON('Login success', {
                        token: user_changed.getToken()
                    }));
                });
            });
        });
    },
    validate: {
        payload: {
            email: Joi.string().email().required(),
            password: Joi.string().required()
        }
    },
    auth: false,
    description: 'Login',
    notes: 'Returns a todo item by the id passed in the path',
    tags: ['api', 'register']
};

/**
 * Register POST
 */
module.exports.registerPost = {
    handler: function (request, reply) {
        const post = request.payload;
        let email = _.get(post, 'email', '');
        let password = _.get(post, 'password', '');
        let code = _.get(post, 'code', '');

        // Tìm xem có thằng nào đăng ký email này chưa?
        new Model.User({
            email: email
        }).fetch().then(function (user) {
            if (!_.isEmpty(user)) {// Email này có rồi!
                return reply(Boom.conflict('Email already exists!'));
            }

            //Đăng ký thôi
            bcrypt.hash(password, 10, function (err, hash) {
                new Model.User({
                    email: email,
                    password: hash,
                    code: code
                }).save().then(function (user) {
                    if (_.isEmpty(user)) {
                        return reply(Boom.serverUnavailable('Service Unavailable'));
                    }

                    return reply(ResponseJSON('Register success!'));
                });
            });
        });
    },
    validate: {
        payload: {
            email: Joi.string().email().min(5).required(),
            password: Joi.string().min(6).required()
        }
    },
    auth: false,
    description: 'Register',
    notes: 'Post register',
    tags: ['api', 'register']
};

/**
 * Logout
 */
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

                return reply(ResponseJSON('Logout success!'));
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