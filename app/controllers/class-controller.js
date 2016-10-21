'use strict';

const _ = require('lodash');
const Boom = require('boom');
const Models = global.Models;
const bcrypt = require('bcrypt');
const Joi = require('joi');
const ResponseJSON = global.helpers.ResponseJSON;
const service = require('../services/all-service');

module.exports.getclass = {
    handler: function (req, rep) {
        let user_data = req.auth.credentials;
        let _id = _.get(user_data, 'id', '');
        let tokenId = _.get(user_data, 'token_id', '');

        new Models.User({
            id : _id
        }).fetch({withRelated: 'classes'}).then(function (user){
            user = user.toJSON();
            delete user.password;
            rep(ResponseJSON('', user));

            service.user.updateToken(tokenId);
        }).catch(function () {
            rep(Boom.badRequest('Some thing went wrong!'));
        });

    },
    auth: {
        mode: 'required',
        strategies: ['jwt']
    },
    description: 'getclass',
    notes: 'get all user\'s classes ',
    tags: ['api', 'get class']
};

module.exports.getTimetable = {
    handler: function (req, rep) {
        let user_data = req.auth.credentials;
        let _id = _.get(user_data, 'id', '');
        let tokenId = _.get(user_data, 'token_id', '');

        new Models.User({
            id : _id
        }).fetch({withRelated: 'classes.lessions'}).then(function (user){
            user = user.toJSON();
            delete user.password;
            rep(ResponseJSON('', user));

            service.user.updateToken(tokenId);
        }).catch(function () {
            rep(Boom.badRequest('Some thing went wrong!'));
        });

    },
    auth: {
        mode: 'required',
        strategies: ['jwt']
    },
    description: 'get timetable',
    notes: 'get all user\'s lessions ',
    tags: ['api', 'get timetable']
};