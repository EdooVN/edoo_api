'use strict';

const _ = require('lodash');
const Boom = require('boom');
const Models = global.Models;
const bcrypt = require('bcrypt');
const Joi = require('joi');
const ResponseJSON = global.helpers.ResponseJSON;
const service = require('../services/AllService');

module.exports.getclass = {
    handler: function (req, rep) {
        let user_data = req.auth.credentials;
        let _id = _.get(user_data, 'id', '');

        new Models.User({
            id : _id
        }).fetch({withRelated: 'classes'}).then(function (user){
            user = user.toJSON();
            delete user.password;
            delete user.session;
            rep(ResponseJSON('', user));

            service.user.updateToken(user.token_id);
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