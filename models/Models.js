/**
 * Created by tmq on 10/07/2016.
 */

var bookshelf = require('../config/db').bookshelf;

var User = module.exports.User = bookshelf.Model.extend({
    tableName: 'users',
    regular_classes: function () {
        return this.belongsToMany(RegularClass, 'users_regular_classes', 'user_id', 'regular_class_id');
    },
    subject_classes: function () {
        return this.belongsToMany(SubjectClass, 'users_subject_classes', 'user_id', 'subject_class_id');
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