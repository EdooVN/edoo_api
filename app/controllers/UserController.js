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
                service.user.saveNewToken(user.toJSON(), function (err, responseData) {
                    if (!err) {
                        return reply(ResponseJSON('Login success!', responseData));
                    } else {
                        return reply(Boom.badRequest('Something went wrong!'));
                    }
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

/**
 * Register firebase token
 */

module.exports.registerFirebaseToken = {
    handler: function (req, rep) {
        let user_data = req.auth.credentials;
        let user_id = _.get(user_data, 'id', '');
        let token_id = _.get(user_data, 'token_id', '');

        let post = req.payload;
        let type = _.get(post, 'type', '');
        let device_token = _.get(post, 'token', '');

        if (type != 'android' && type != 'ios' && type != 'web') {
            return rep(Boom.badData('invalid type, the type is: android/ios/web'));
        }

        service.user.saveFcmToken(user_id, type, token_id, device_token, function (err, res) {
            if (!err){
                return rep(ResponseJSON('Resgister FCM success', res));
            } else {
                return rep(Boom.badData('Something went wrong!'));
            }
        })
    },
    auth: {
        mode: 'required',
        strategies: ['jwt']
    },
    validate: {
        payload: {
            type: Joi.string().required(),
            token: Joi.string().required()
        }
    },
    description: 'register firebase token',
    notes: 'type: android/ios/web',
    tags: ['api', 'register firebase token']
};

module.exports.getSolveVote = {
    handler: function (req, rep) {
        let user_data = req.auth.credentials;
        let user_id = _.get(user_data, 'id', '');

        service.post.getSolveCount(user_id, function (res) {
            rep(ResponseJSON('Success', res));
        });

    },
    auth: {
        mode: 'required',
        strategies: ['jwt']
    },
    description: 'get solve vote',
    notes: 'get solve vote of user',
    tags: ['api', 'get solve vote']
};


module.exports.getProfile = {
    handler: function (req, rep) {
        let user_data = req.auth.credentials;
        let user_id = _.get(user_data, 'id', '');

        service.user.getUserInfo(user_id, function (res) {
            // let solveCount = res.solve_count;
            // let voteCount = res.vote_count;
            //
            // let point = solveCount*40 + voteCount*5;
            //
            // let response = {
            //     point: point
            // };

            rep(ResponseJSON('Success', res));
        });

    },
    auth: {
        mode: 'required',
        strategies: ['jwt']
    },
    description: 'get solve vote',
    notes: 'get solve vote of user',
    tags: ['api', 'get solve vote']
};


module.exports.updateProfile = {
    handler: function (req, rep) {
        let user_data = req.auth.credentials;
        let payload = req.payload;
        let user_id = _.get(user_data, 'id', '');
        let favorite = _.get(payload, 'favorite', '');
        let description = _.get(payload, 'description', '');

        service.user.updateUserProfile(user_id, favorite, description, function (res) {
            rep(ResponseJSON('Success', res));
        });

    },
    auth: {
        mode: 'required',
        strategies: ['jwt']
    },
    validate: {
        payload: {
            description: Joi.string().optional(),
            favorite: Joi.string().optional()
        }
    },
    description: 'get solve vote',
    notes: 'get solve vote of user',
    tags: ['api', 'get solve vote']
};


module.exports.changePassword = {
    handler: function (req, rep) {
        let user_data = req.auth.credentials;
        let payload = req.payload;
        let user_id = _.get(user_data, 'id', '');
        let old_password = _.get(payload, 'old_password', '');
        let new_password = _.get(payload, 'new_password', '');

        service.user.changePassword(user_id, old_password, new_password, function (err, res) {
            if (!err) {
                return rep(ResponseJSON('Success', res));
            } else {
                return rep(Boom.badData(res));
            }
        });

    },
    auth: {
        mode: 'required',
        strategies: ['jwt']
    },
    validate: {
        payload: {
            old_password: Joi.string().required(),
            new_password: Joi.string().required()
        }
    },
    description: 'get solve vote',
    notes: 'get solve vote of user',
    tags: ['api', 'get solve vote']
};

module.exports.sendResetPass = {
    handler : function (req, rep) {
        let payload = req.payload;
        let email = _.get(payload, 'email', '');
        let code = _.get(payload, 'code', '');

        service.user.sendResetPass(email, code, function (err, resData) {
            if (!err){
                rep(ResponseJSON('Send success', resData));
            } else {
                rep(Boom.badData(resData));
            }
        });
    },
    auth: false,
    validate: {
        payload : {
            email: Joi.string().email().required(),
            code : Joi.string().required()
        }
    },
    description: 'reset password',
    notes: 'reset pass',
    tags: ['api', 'reset password']
};

module.exports.resetPass = {
    handler : function (req, rep) {
        let user_data = req.auth.credentials;
        let payload = req.payload;
        let user_id = _.get(user_data, 'id', '');
        let is_token_refresh_pass = _.get(user_data, 'is_token_refresh_pass', false);
        let new_password = _.get(payload, 'new_password', '');

        if (!is_token_refresh_pass){
            return rep(Boom.badData('Token is invalid'));
        }

        service.user.resetNewPass(user_id, new_password, function (err, resData) {
            if (!err){
                rep(ResponseJSON('Reset password success', resData));
            } else {
                rep(Boom.badData(resData));
            }
        });
    },
    auth: {
        mode: 'required',
        strategies: ['jwt']
    },
    validate: {
        payload: {
            new_password: Joi.string().required()
        }
    },
    description: 'reset pass',
    notes: 'reset pass',
    tags: ['api', 'reset pass']
};








