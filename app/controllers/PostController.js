'use strict';
const _ = require('lodash');
const fs = require('fs');
const Boom = require('boom');
const Models = global.Models;
const bcrypt = require('bcrypt');
const Joi = require('joi');
const ResponseJSON = global.helpers.ResponseJSON;
const helpers = global.helpers;
const config = helpers.config;

module.exports.getpost = {
    handler: function (req, rep) {
        let class_id = encodeURIComponent(req.params.class_id);

        new Models.Class({id: class_id}).fetch({withRelated: 'posts.user'}).then(function (result) {
            result = result.toJSON();
            let posts = result.posts;

            for (var i = 0; i < posts.length; i++) {
                posts[i].author = posts[i].user;
                delete posts[i].user;
                delete posts[i].author.password;
                delete posts[i].author.session;
            }

            rep(ResponseJSON('', result));
        }).catch(function () {
            rep(Boom.badData('Something went wrong!'));
        });
    },
    auth: {
        mode: 'required',
        strategies: ['jwt']
    },
    description: 'get posts',
    notes: 'get posts of class',
    tags: ['api', 'post']
};

module.exports.postPost = {
    handler: function (req, rep) {
        let user_data = req.auth.credentials;
        let post = req.payload;
        let user_id = _.get(user_data, 'id', '');
        let class_id = _.get(post, 'class_id', '');
        let title = _.get(post, 'title', '');
        let content = _.get(post, 'content', '');
        let type = _.get(post, 'type', '');
        let tag = _.get(post, 'tag', '');

        new Models.Post({
            user_id: user_id,
            class_id: class_id,
            title: title,
            content: content,
            type: type,
            tag: tag
        }).save().then(function (result) {
            rep(ResponseJSON('Post success', result));
        }).catch(function () {
            rep(Boom.badData('Something went wrong!'));
        });
    },
    auth: {
        mode: 'required',
        strategies: ['jwt']
    },
    validate: {
        payload: {
            // user_id: Joi.string().alphanum().required(),
            class_id: Joi.string().alphanum().required(),
            title: Joi.string().required(),
            content: Joi.string().required(),
            type: Joi.string().required(),
            tag: Joi.string().optional()
        }
    },
    description: 'post a post to class',
    notes: 'post a post to class',
    tags: ['api', 'post']
};

/**
 * get a detail post (with cmt)
 */

module.exports.postDetail = {
    handler: function (req, rep) {
        let user_data = req.auth.credentials;
        let user_id = _.get(user_data, 'id', '');
        let post_id = encodeURIComponent(req.params.post_id);

        new Models.Post({
            id: post_id,
            user_id: user_id
        }).fetch({withRelated: ['votes.user', 'comments.user', 'user', 'comments.votes.user']}).then(function (post) {
            post = post.toJSON();

            // xoa thong tin user khong can thiet cua post && cmt
            post.author = post.user;
            delete post.user;
            delete post.author.password;
            delete post.author.session;

            let cmts = post.comments;
            for (var i = 0; i < cmts.length; i++) {
                let tempCmt = cmts[i];
                tempCmt.author = tempCmt.user;
                delete tempCmt.user;
                delete tempCmt.author.password;
                delete tempCmt.author.session;

                // xoa thong tin user khong can thiet cua vote cmt
                let votes = tempCmt.votes;
                for (var j = 0; j < votes.length; j++) {
                    let tempVote = votes[j];
                    tempVote.author = tempVote.user;
                    delete tempVote.user;
                    delete tempVote.author.password;
                    delete tempVote.author.session;
                }
            }

            // xoa thong tin user khong can thiet cua vote
            let votes = post.votes;
            for (var i = 0; i < votes.length; i++) {
                let tempVote = votes[i];
                tempVote.author = tempVote.user;
                delete tempVote.user;
                delete tempVote.author.password;
                delete tempVote.author.session;
            }

            rep(ResponseJSON('', post));
        }).catch(function () {
            rep(Boom.badData('Something went wrong!'));
        });
    },
    auth: {
        mode: 'required',
        strategies: ['jwt']
    },
    description: 'get post detail',
    notes: 'post detail',
    tags: ['api', 'post']
};

/**
 * cmt
 */

module.exports.postCmt = {
    handler: function (req, rep) {
        let user_data = req.auth.credentials;
        let post = req.payload;
        let user_id = _.get(user_data, 'id', '');
        let post_id = _.get(post, 'post_id', '');
        let content = _.get(post, 'content', '');

        new Models.Comment({
            user_id: user_id,
            post_id: post_id,
            content: content,
            is_solve: false
        }).save().then(function (result) {
            if (result) {
                rep(ResponseJSON('Comment success!'));
            }
        }).catch(function () {
            rep(Boom.badData('Something went wrong!'));
        });
    },
    auth: {
        mode: 'required',
        strategies: ['jwt']
    },
    validate: {
        payload: {
            post_id: Joi.string().alphanum().required(),
            content: Joi.string().required()
        }
    },
    description: 'post cmt',
    notes: 'post cmt',
    tags: ['api', 'post']
};

/**
 * vote/devote the post
 */

module.exports.postVote = {
    handler : function (req, rep) {
        let user_data = req.auth.credentials;
        let post = req.payload;
        let user_id = _.get(user_data, 'id', '');
        let post_id = _.get(post, 'post_id', '');
        let content = _.get(post, 'content', '');

        let up = (content > 0);

        if (content == 0){
            new Models.Vote({
                user_id: user_id,
                post_id: post_id
            }).fetch().then(function (result) {
                if (_.isEmpty(result)){
                    return rep(Boom.badData('destroy fail'));
                }
                new Models.Vote({id : result.id}).destroy().then(function () {
                    // console.log('destroy ok');
                    // console.log(result.toJSON());
                    return rep(ResponseJSON('Success', result.toJSON()));
                }).catch(function () {
                    console.log('destroy fail');
                    return rep(Boom.badData('destroy fail'));
                });
            })
        } else {
            new Models.Vote({
                user_id: user_id,
                post_id: post_id
            }).fetch().then(function (result) {
                if (_.isEmpty(result)) {
                    // console.log('empty');
                    throw new Error('empty');
                } else {
                    // console.log(result.toJSON());
                    result = result.toJSON();
                    // update
                    new Models.Vote({
                        id: result.id
                    }).save({up : up}, {method: 'update', patch: true}).then(function (result) {
                        // console.log('update ok men');
                        // console.log(result.toJSON());
                        return rep(ResponseJSON('Success', result.toJSON()));
                    }).catch(function () {
                        // console.log('update fail');
                        return rep(Boom.badData('update fail'));
                    })
                }
            }).catch(function (err) {
                // add new
                // console.log('loi cmnr');
                // console.log(err);

                new Models.Vote({
                    user_id : user_id,
                    post_id : post_id,
                    up : up,
                    type : 'post'
                }).save().then(function (result) {
                    // console.log('insert ok');
                    // console.log(result.toJSON());
                    return rep(ResponseJSON('Success', result.toJSON()));
                }).catch(function () {
                    // console.log('insert fail');
                    return rep(Boom.badData('destroy fail'));
                });
            });
        }

    },
    auth: {
        mode: 'required',
        strategies: ['jwt']
    },
    validate: {
        payload: {
            post_id: Joi.string().alphanum().required(),
            content: Joi.number().integer().required()
        }
    },
    description: 'post vote',
    notes: 'post vote',
    tags: ['api', 'post', 'vote']
};

/**
 * vote/devote the cmt
 */

module.exports.postCmt = {
    handler : function (req, rep) {
        let user_data = req.auth.credentials;
        let post = req.payload;
        let user_id = _.get(user_data, 'id', '');
        let comment_id = _.get(post, 'comment_id', '');
        let content = _.get(post, 'content', '');

        let up = (content > 0);

        if (content == 0){
            new Models.Vote({
                user_id: user_id,
                comment_id: comment_id
            }).fetch().then(function (result) {
                if (_.isEmpty(result)){
                    return rep(Boom.badData('destroy fail'));
                }
                new Models.Vote({id : result.id}).destroy().then(function () {
                    // console.log('destroy ok');
                    // console.log(result.toJSON());
                    return rep(ResponseJSON('Success', result.toJSON()));
                }).catch(function () {
                    console.log('destroy fail');
                    return rep(Boom.badData('destroy fail'));
                });
            })
        } else {
            new Models.Vote({
                user_id: user_id,
                comment_id: comment_id
            }).fetch().then(function (result) {
                if (_.isEmpty(result)) {
                    // console.log('empty');
                    throw new Error('empty');
                } else {
                    // console.log(result.toJSON());
                    result = result.toJSON();
                    // update
                    new Models.Vote({
                        id: result.id
                    }).save({up : up}, {method: 'update', patch: true}).then(function (result) {
                        // console.log('update ok men');
                        // console.log(result.toJSON());
                        return rep(ResponseJSON('Success', result.toJSON()));
                    }).catch(function () {
                        // console.log('update fail');
                        return rep(Boom.badData('update fail'));
                    })
                }
            }).catch(function (err) {
                // add new
                // console.log('loi cmnr');
                // console.log(err);

                new Models.Vote({
                    user_id : user_id,
                    comment_id : comment_id,
                    up : up,
                    type : 'comment'
                }).save().then(function (result) {
                    // console.log('insert ok');
                    // console.log(result.toJSON());
                    return rep(ResponseJSON('Success', result.toJSON()));
                }).catch(function () {
                    // console.log('insert fail');
                    return rep(Boom.badData('destroy fail'));
                });
            });
        }

    },
    auth: {
        mode: 'required',
        strategies: ['jwt']
    },
    validate: {
        payload: {
            comment_id: Joi.string().alphanum().required(),
            content: Joi.number().integer().required()
        }
    },
    description: 'post vote cmt',
    notes: 'post vote cmt',
    tags: ['api', 'post', 'vote']
};

/**
 * Post owner tick solved to cmt
 */
module.exports.postSolve = {
    handler: function (req, rep) {
        let user_data = req.auth.credentials;
        let user_id = _.get(user_data, 'id', '');
        let post = req.payload;
        let comment_id = _.get(post, 'comment_id', '');

        new Models.Comment({id: comment_id}).fetch({withRelated: ['post.comments']})
            .then(function (result) {
                result = result.toJSON();
                let tempPost = result.post;

                console.log(user_id);
                console.log(tempPost.user_id);

                if (user_id == tempPost.user_id){
                    //find the cmt is solve and remove solve from it
                    let cmts = tempPost.comments;
                    let cmtIdSolve = 0;
                    for (let i=0; i<cmts.length; i++){
                        let tempCmt = cmts[i];
                        if (tempCmt.is_solve > 0){
                            cmtIdSolve = tempCmt.id;
                            break;
                        }
                    }

                    if (cmtIdSolve != 0){
                        new Models.Comment({id : cmtIdSolve})
                            .save({is_solve: false}, {method: 'update', patch: true})
                            .then(function () {
                                new Models.Comment({id : comment_id})
                                    .save({is_solve: true}, {method: 'update', patch: true})
                                    .then(function (result) {
                                        rep(ResponseJSON('Success', result));
                                    }).catch(function () {
                                    rep(Boom.badData(''));
                                });
                            }).catch(function () {
                            rep(Boom.badData(''));
                        });
                    }

                    new Models.Comment({id : comment_id})
                        .save({is_solve: true}, {method: 'update', patch: true})
                        .then(function (result) {
                            rep(ResponseJSON('Success', result));
                        }).catch(function () {
                        rep(Boom.badData(''));
                    });

                } else {
                    rep(Boom.unauthorized('You are not the post\'author'));
                }
        }).catch(function () {
            rep(Boom.badData('Something went wrong!'));
        });
    },
    auth: {
        mode: 'required',
        strategies: ['jwt']
    },
    validate: {
        payload: {
            comment_id: Joi.string().alphanum().required()
        }
    },
    description: 'post solve',
    notes: 'post solve',
    tags: ['api', 'post', 'solve']
};

/**
 * get all rep comment
 * method : GET
 * param: comment_id
 */
module.exports.repComments = {
    handler : function (req, rep) {
        let cmtId = encodeURIComponent(req.params.comment_id);

        new Models.Comment({
            id : cmtId
        }).fetch({withRelated : 'repComments.user'}).then(function (cmt) {
            cmt = cmt.toJSON();
            let repCmts = cmt.repComments;
            for (var i=0; i<repCmts.length; i++){
                let repCmt = repCmts[i];
                repCmt.author = repCmt.user;
                delete repCmt.user;
                delete repCmt.author.password;
                delete repCmt.author.token_id;
                if (repCmt.is_incognito == true){
                    delete repCmt.author;
                    delete repCmt.user_id;
                }
            }
            rep(ResponseJSON('', repCmts));
        }).catch(function () {
            rep(Boom.badData('Something went wrong!'));
        });
    },
    auth: {
        mode: 'required',
        strategies: ['jwt']
    },
    description: 'get rep comments',
    notes: 'get rep comments',
    tags: ['api', 'post', 'rep cmt']
};

/**
 * API to post a rep_cmt
 * params: comment_id, user_id, content, is_incognito
 * method: POST
 */
module.exports.postRepCmt = {
    handler : function (req, rep) {
        let user_data = req.auth.credentials;
        let post = req.payload;
        let userId = _.get(user_data, 'id', '');
        let commentId = _.get(post, 'comment_id', '');
        let content = _.get(post, 'content', '');
        let isIncognito = _.get(post , 'is_incognito', false);

        new Models.RepComment({
            comment_id : commentId,
            user_id : userId,
            content : content,
            is_incognito : isIncognito
        }).save().then(function (cmt) {
            rep(ResponseJSON('Rep cmt success!', cmt));
        }).catch(function (err) {
            console.log(err);
            rep(Boom.badData('Something went wrong!'));
        });
    },
    auth: {
        mode: 'required',
        strategies: ['jwt']
    },
    validate : {
        payload: {
            comment_id : Joi.number().integer().required(),
            content : Joi.string().required(),
            is_incognito : Joi.boolean().optional()
        }
    },
    description: 'post rep comments',
    notes: 'post rep comments',
    tags: ['api', 'post', 'post cmt']
};

/**
 * Post/attack a image
 * @return linkImg : String
 */

module.exports.uploadImage = {
    handler: function (req, rep) {
        let user_data = req.auth.credentials;
        let user_id = _.get(user_data, 'id', '');
        let data = req.payload;

        if (data.file) {
            let name = data.file.hapi.filename;
            let savePath = config('PATH_IMG_UPLOAD', '/');
            var path = savePath + user_id + name;

            console.log(path);
            // console.log(fs.statSync(path).isFile());

            var file = fs.createWriteStream(path);

            file.on('error', function (err) {
                console.error(err);
                rep(Boom.badData('Something went wrong!'));
            });

            data.file.pipe(file);

            data.file.on('end', function (err) {
                var res = {
                    filename: data.file.hapi.filename,
                    headers: data.file.hapi.headers,
                    path: path
                };
                rep(ResponseJSON('Upload success!', res));
            })
        } else {
            rep(Boom.badData('Data is wrong!'));
        }
    },
    auth: {
        mode: 'required',
        strategies: ['jwt']
    },
    payload: {
        output: 'stream',
        maxBytes: 2097152,
        allow: 'multipart/form-data',
        parse: true
    },
    description: 'post a image',
    notes: 'post a image',
    tags: ['api', 'post']
};

