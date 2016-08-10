'use strict';

const bookshelf = require('../config/bookshelft');
const jwt = require('jsonwebtoken');

let config = global.helpers.config;
let key = config('SERVER_KEY', '');

var User = module.exports.User = bookshelf.Model.extend({
    tableName: 'users',

    tokens : function () {
        return this.hasMany(Token);
    },

    classes: function () {
        return this.belongsToMany(Class, 'users_classes', 'user_id', 'class_id');
    },

    posts: function () {
        return this.hasMany(Post);
    },

    votes: function () {
        return this.hasMany(Vote);
    },

    /**
     * Get token
     * @return string
     */
    getToken: function () {
        let user = this.toJSON();

        return jwt.sign(user, key);
    }
});

var Token = module.exports.Token = bookshelf.Model.extend({
    tableName : 'tokens',
    user : function () {
        return this.belongsTo(User);
    }
});

var Class = module.exports.Class = bookshelf.Model.extend({
    tableName: 'classes',

    posts: function () {
        return this.hasMany(Post);
    },

    users: function () {
        return this.belongsToMany(User, 'users_classes', 'class_id', 'user_id');
    }
});

var User_Class = module.exports.User_Class = bookshelf.Model.extend({
    tableName: 'users_classes',
});

var Post = module.exports.Post = bookshelf.Model.extend({
    tableName: 'posts',
    user: function () {
        return this.belongsTo(User);
    },
    votes: function () {
        return this.hasMany(Vote);
    },
    comments: function () {
        return this.hasMany(Comment);
    }
});

var Comment = module.exports.Comment = bookshelf.Model.extend({
    tableName: 'comments',
    votes: function () {
        return this.hasMany(Vote);
    },
    post: function () {
        return this.belongsTo(Post);
    },
    user: function () {
        return this.belongsTo(User);
    },
    repComments: function () {
        return this.hasMany(RepComment);
    }
});

var Vote = module.exports.Vote = bookshelf.Model.extend({
    tableName: 'votes',

    user: function () {
        return this.belongsTo(User);
    },
    post: function () {
        return this.belongsTo(Post);
    },
    comment: function () {
        return this.belongsTo(Comment);
    }
});

var RepComment = module.exports.RepComment = bookshelf.Model.extend({
   tableName : 'rep_comments',

    user: function () {
        return this.belongsTo(User);
    },
    comment: function () {
        return this.belongsTo(Comment);
    }
});