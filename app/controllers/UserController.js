'use strict';

const _ = require('lodash');
const Boom = require('boom');
const Models = global.Models;
const bcrypt = require('bcrypt');
const Joi = require('joi');
const ResponseJSON = global.helpers.ResponseJSON;
const commons = global.helpers.commons;
const service = require('../services/AllService');

/***
 * Login POST
 */
module.exports.loginPost = {
    handler: function (request, reply) {

        const post = request.payload;
        let email = _.get(post, 'email', '');
        let password = _.get(post, 'password', '');

        new Models.User({
            email: email
        }).fetch().then(function (user) {
            if (_.isEmpty(user)) {//Email doesn't exist
                return reply(Boom.unauthorized('Email doesn\'t exist!'));
            }

            bcrypt.compare(password, user.get('password'), function (err, res) {
                if (!res) {//Password invalid
                    return reply(Boom.unauthorized('Invalid password!'));
                }

                // save token
                new Models.Token({
                    user_id: user.get('id'),
                    time_expire: (Date.now() + commons.timeExtension)
                }).save().then(function (tokenSql) {
                    let tokenId = tokenSql.get('id');
                    user = user.toJSON();
                    user.token_id = tokenId;

                    service.user.getTokenUser(user, function (tokenUser) {
                        delete user.password;
                        delete user.id;
                        delete user.token_id;
                        reply(ResponseJSON('Login success', {
                            token: tokenUser,
                            user: user
                        }));
                    });

                }).catch(function () {
                    return reply(Boom.badRequest('Something went wrong!'));
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
    notes: 'Returns a token\'s user, client should save it carefully',
    tags: ['api', 'login']
};

/**
 * Register POST
 */
// module.exports.registerPost = {
//     handler: function (request, reply) {
//         const post = request.payload;
//         let email = _.get(post, 'email', '');
//         let password = _.get(post, 'password', '');
//         //mssv
//         let code = _.get(post, 'code', '');
//
//         // Tìm xem có thằng nào đăng ký email này chưa?
//         new Models.User({
//             email: email
//         }).fetch().then(function (user) {
//             if (!_.isEmpty(user)) {// Email này có rồi!
//                 return reply(Boom.conflict('Email already exists!'));
//             }
//
//             //Đăng ký thôi
//             bcrypt.hash(password, 10, function (err, hash) {
//                 new Models.User({
//                     email: email,
//                     password: hash,
//                     code: code
//                 }).save().then(function (user) {
//                     if (_.isEmpty(user)) {
//                         return reply(Boom.serverUnavailable('Service Unavailable'));
//                     }
//
//                     return reply(ResponseJSON('Register success!'));
//                 });
//             });
//         });
//     },
//     validate: {
//         payload: {
//             email: Joi.string().email().min(5).required(),
//             password: Joi.string().min(6).required()
//         }
//     },
//     auth: false,
//     description: 'Register',
//     notes: 'Post register',
//     tags: ['api', 'register']
// };

/**
 * Logout
 */
module.exports.logout = {
    handler: function (request, reply) {
        let user_data = request.auth.credentials;
        // let _id = _.get(user_data, 'id', '');
        let tokenId = _.get(user_data, 'token_id', '');

        new Models.Token({
            id: tokenId
        }).destroy().then(function (token) {
            if (_.isEmpty(token)) {
                return reply(Boom.badRequest('Some thing went wrong!'));
            }

            return reply(ResponseJSON('Logout success!'));
        }).catch(function () {
            return reply(Boom.badRequest('Some thing went wrong!'));
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