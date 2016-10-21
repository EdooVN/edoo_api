'use strict';

const _ = require('lodash');
const Boom = require('boom');
const Models = global.Models;
const bcrypt = require('bcrypt');
const Joi = require('joi');
const ResponseJSON = global.helpers.ResponseJSON;
const service = require('../services/all-service');

/**
 * Add user by Admin
 */
module.exports.addUser = {
    handler: function (request, rep) {
        const post = request.payload;
        let email = _.get(post, 'email', '');
        let username = _.get(post, 'username', '');
        let code = _.get(post, 'code', '');
        let capability = _.get(post, 'capability', '').toLowerCase();
        let pass = _.get(post, 'password', '');
        let name = _.get(post, 'name', '');
        let birth = _.get(post, 'birthday', '');
        let regular_class = _.get(post, 'regular_class', '');

        service.user.insertNewStudentToDatabase(email, code, name,
            username, pass, capability, birth, regular_class, function (err, res) {
                if (!err) {
                    return rep(ResponseJSON('Add user success!', res));
                } else {
                    return rep(Boom.badData(res));
                }
            })

    },
    validate: {
        payload: {
            email: Joi.string().email().required(),
            code: Joi.string().alphanum().required(),
            capability: Joi.string().alphanum().required(),
            username: Joi.string().token().optional(),
            password: Joi.string().optional(),
            birthday: Joi.string().optional(),
            name: Joi.string().optional(),
            regular_class: Joi.string().optional()
        }
    },
    auth: false,
    description: 'Add user',
    notes: 'For manager, ' +
    'By default, password is equal code',
    tags: ['api', 'add_user']
};

/**
 * add class
 */

module.exports.addAClass = {
    handler: function (req, rep) {
        const post = req.payload;

        let name = _.get(post, 'name', '');
        let code = _.get(post, 'code', '');
        let type = _.get(post, 'type', '');
        let semester = _.get(post, 'semester', '');
        let credit_count = _.get(post, 'credit_count', '');
        let student_count = _.get(post, 'student_count', '');
        let teacher_name = _.get(post, 'teacher_name', '');

        let id_class = code + semester;
        new Models.Class({
            id: id_class,
            name: name,
            code: code,
            type: type,
            semester: semester,
            credit_count: credit_count,
            student_count: student_count,
            teacher_name: teacher_name
        }).save(null, {method: 'insert'}).then(function (result) {
            rep(ResponseJSON('Add class success!', result));
        }).catch(function (err) {
            console.log(err);
            rep(Boom.badData('Something went wrong!'));
        });
    },
    auth: false,
    validate: {
        payload: {
            name: Joi.string().required(),
            code: Joi.string().alphanum().required(),
            type: Joi.string().required(),
            semester: Joi.string().required(),
            credit_count: Joi.number().integer().required(),
            student_count: Joi.number().integer().required(),
            teacher_name: Joi.string().required()
        }
    },
    description: 'add class',
    notes: 'For manager, add class',
    tags: ['api', 'add class']
};

/**
 * Join class
 */
module.exports.joinclass = {
    handler: function (req, rep) {
        const post = req.payload;
        let userCode = _.get(post, 'user_code', '');
        let classId = _.get(post, 'class_id', '');

        service.user.userJoinClass(userCode, classId, function (err, res) {
            if (!err){
                rep(ResponseJSON(res));
            } else {
                rep(Boom.badData(res));
            }
        });
    },
    validate: {
        payload: {
            user_code: Joi.string().alphanum().required(),
            class_id: Joi.string().required()
        }
    },
    description: 'join class',
    notes: 'For manager, join class',
    tags: ['api', 'joinclass']
};

module.exports.addUserFromFileExel = {
    handler: function (req, rep) {
        let user_data = req.auth.credentials;
        let user_id = _.get(user_data, 'id', '');
        let user_code = _.get(user_data, 'code', '');
        let data = req.payload;

        if (data.file) {
            let file = data.file;
            // check mime type ?= image
            // let headers = file.hapi.headers;

            service.user.addUserFromFileExel(file, user_id, user_code, function (err, res) {
                if (!err) {
                    return rep(ResponseJSON('Import user success!', res));
                } else {
                    return rep(Boom.badData('Something went wrong!'));
                }
            });
        } else {
            return rep(Boom.badData('Data is wrong!'));
        }
    },
    auth: false,
    payload: {
        // class_id: Joi.string().required(),
        output: 'stream',
        maxBytes: 20097152,
        allow: 'multipart/form-data',
        parse: true
    },
    description: 'post file',
    notes: 'post file',
    tags: ['api', 'file']

};