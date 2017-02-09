'use strict';

const _ = require('lodash');
const Boom = require('boom');
const Models = global.Models;
const bcrypt = require('bcrypt');
const Joi = require('joi');
const ResponseJSON = global.helpers.ResponseJSON;
const service = require('../services/all-service');

module.exports.auth = {
    handler: function (req, rep) {
        service.authGoogle.getRedirectOAuthUrl(function (err, url) {
            if (err) {
                rep('Something went wrong!');
            } else {
                rep.redirect(url);
            }
        })
    }
};

module.exports.getAuthCode = {
    handler: function (req, rep) {
        let code = req.query.code;

        if (!code){
            return rep('Some thing went wrong');
        }

        service.authGoogle.getUserInfo(code, function (err, userInfo) {
            if (err) {
                return rep('Some thing went wrong');
            }

            let email = userInfo.emails[0].value;
            let avatarUrl = encodeURI(userInfo.image.url);
            return rep.redirect(`https://edoo.vn/#!/register?email=${email}&avatar=${avatarUrl}`);
        });
    }
};