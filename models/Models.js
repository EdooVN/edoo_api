'use strict';

const bookshelf = require('../config/bookshelft').bookshelf;
const jwt = require('jsonwebtoken');

let config = global.helpers.config;
let key = config('SERVER_KEY', '');

var User = module.exports.User = bookshelf.Model.extend({
    tableName: 'users',

    user_detail: function () {
        return this.hasOne(UserDetail);
    },

    tokens: function () {
        return this.hasMany(Token);
    },

    firebase_tokens: function () {
        return this.hasMany(FirebaseToken);
    },

    attack_files: function () {
        return this.hasMany(AttackFile);
    },

    classes: function () {
        return this.belongsToMany(Class, 'users_classes', 'user_id', 'class_id');
    },

    posts: function () {
        return this.hasMany(Post);
    },

    comments: function () {
        return this.hasMany(Comment);
    },

    votes: function () {
        return this.hasMany(Vote);
    },

    supports: function () {
        return this.hasMany(Support);
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

var UserDetail = module.exports.UserDetail = bookshelf.Model.extend({
    tableName: 'user_detail',
    user: function () {
        return this.belongsTo(User);
    }
});

var Token = module.exports.Token = bookshelf.Model.extend({
    tableName: 'tokens',
    firebase_token: function () {
        return this.hasOne(FirebaseToken)
    },
    user: function () {
        return this.belongsTo(User);
    }
});

var FirebaseToken = module.exports.FirebaseToken = bookshelf.Model.extend({
    tableName: 'firebase_tokens',
    user: function () {
        return this.belongsTo(User);
    },
    token : function () {
        return this.belongsTo(Token)
    }
});

var AttackFile = module.exports.AttackFile = bookshelf.Model.extend({
    tableName: 'attack_files',
    user: function () {
        return this.belongsTo(User);
    }
});

var Class = module.exports.Class = bookshelf.Model.extend({
    tableName: 'classes',

    lessions: function () {
        return this.hasMany(Lession);
    },

    posts: function () {
        return this.hasMany(Post);
    },

    users: function () {
        return this.belongsToMany(User, 'users_classes', 'class_id', 'user_id');
    }
});

var User_Class = module.exports.User_Class = bookshelf.Model.extend({
    tableName: 'users_classes'
});

var Lession = module.exports.Lession = bookshelf.Model.extend({
    tableName: 'lessions'
});

var Post = module.exports.Post = bookshelf.Model.extend({
    tableName: 'posts',
    user: function () {
        return this.belongsTo(User);
    },
    class: function () {
        return this.belongsTo(Class);
    },
    votes: function () {
        return this.hasMany(Vote);
    },
    comments: function () {
        return this.hasMany(Comment);
    },
    seens: function () {
        return this.hasMany(Seen);
    },
    event_extend: function () {
        return this.hasOne(EventExtend)
    },
    attack_files: function () {
        return this.hasMany(AttackFile)
    }
});

var EventExtend = module.exports.EventExtend = bookshelf.Model.extend({
    tableName: 'event_extend',
    post: function () {
        return this.belongsTo(Post);
    }
});

var Seen = module.exports.Seen = bookshelf.Model.extend({
    tableName: 'seens'
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
    tableName: 'rep_comments',

    user: function () {
        return this.belongsTo(User);
    },
    comment: function () {
        return this.belongsTo(Comment);
    }
});

var Support = module.exports.Support = bookshelf.Model.extend({
    tableName: 'supports',

    user: function () {
        return this.belongsTo(User);
    }
});