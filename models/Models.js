'use strict';

const bookshelf = require('../config/db').bookshelf;
const jwt = require('jsonwebtoken');
let key = global.config.secret;

var User = module.exports.User = bookshelf.Model.extend({
    tableName: 'users',


    regular_classes: function () {
        return this.belongsToMany(RegularClass, 'users_regular_classes', 'user_id', 'regular_class_id');
    },


    subject_classes: function () {
        return this.belongsToMany(SubjectClass, 'users_subject_classes', 'user_id', 'subject_class_id');
    },


    generateSession: function () {
        const rd = require('randomstring');
        let session_str = rd.generate(50);

        return this.save({
            session: session_str
        });
    },

    /**
     * Get token
     * @return string
     */
    getToken: function () {
        let user = this.toJSON();

        return jwt.sign(user, key);
    },

    /**
     * Destroy token
     * @return Promise
     */
    destroyToken: function () {
        return this.save({
            session: ''
        });
    }
});

var RegularClass = module.exports.RegularClass = bookshelf.Model.extend({
    tableName: 'regular_classes',


    users: function () {
        return this.belongsToMany(User, 'users_regular_classes', 'regular_class_id', 'user_id');
    }
});

var SubjectClass = module.exports.SubjectClass = bookshelf.Model.extend({
    tableName: 'subject_classes',


    users: function () {
        return this.belongsToMany(User, 'users_subject_classes', 'subject_class_id', 'user_id');
    }
});