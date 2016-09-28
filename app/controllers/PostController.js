'use strict';
const _ = require('lodash');
const fs = require('fs');
const Entities = require('html-entities').AllHtmlEntities;
const Boom = require('boom');
const Models = global.Models;
const bcrypt = require('bcrypt');
const Joi = require('joi');
const mkdirp = require('mkdirp');
const ResponseJSON = global.helpers.ResponseJSON;
const helpers = global.helpers;
const config = helpers.config;
const service = require('../services/AllService');

const page_size = helpers.commons.page_size;

module.exports.getpost = {
    handler: function (req, rep) {
        let user_data = req.auth.credentials;
        let user_id = _.get(user_data, 'id', '');
        let class_id = encodeURIComponent(req.params.class_id);

        service.post.getPostInPage(1, 100, class_id, user_id, function (err, res) {
            if (!err) {
                rep(ResponseJSON('', res));
            } else {
                rep(Boom.badData('Something went wrong!'));
            }
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

module.exports.getPostsInPage = {
    handler: function (req, rep) {
        let user_data = req.auth.credentials;
        let user_id = _.get(user_data, 'id', '');
        let class_id = encodeURIComponent(req.params.class_id);
        let page_number = encodeURIComponent(req.params.page_number);

        let params = req.query;

        if (!_.isEmpty(params)) {
            if (params.filter == 'post_teacher') {
                service.post.getPostInPageFilterTeacher(page_number, page_size, class_id, user_id, function (err, res) {
                    if (!err) {
                        return rep(ResponseJSON('', res));
                    } else {
                        return rep(Boom.badData('Something went wrong!'));
                    }
                });
            } else if (params.filter == 'post_notsolve') {
                service.post.getPostInPageFilterSolve(page_number, page_size, class_id, user_id, function (err, res) {
                    if (!err) {
                        return rep(ResponseJSON('', res));
                    } else {
                        return rep(Boom.badData('Something went wrong!'));
                    }
                });
            } else if (params.filter == 'post_notseen') {
                service.post.getPostInPageFilterNotSeen(page_number, page_size, class_id, user_id, function (err, res) {
                    if (!err) {
                        return rep(ResponseJSON('', res));
                    } else {
                        return rep(Boom.badData('Something went wrong!'));
                    }
                });
            }

            return;
        }

        service.post.getPostInPage(page_number, page_size, class_id, user_id, function (err, res) {
            if (!err) {
                return rep(ResponseJSON('', res));
            } else {
                return rep(Boom.badData('Something went wrong!'));
            }
        });
    },
    auth: {
        mode: 'required',
        strategies: ['jwt']
    },
    description: 'get posts with page',
    notes: 'get posts of class',
    tags: ['api', 'post']
};

module.exports.postPost = {
    handler: function (req, rep) {
        let user_data = req.auth.credentials;
        let post = req.payload;
        let user_id = _.get(user_data, 'id', '');
        let user_name = _.get(user_data, 'name', '');
        let capability = _.get(user_data, 'capability', '');
        let is_post_teacher = (capability == 'teacher');
        let class_id = _.get(post, 'class_id', '');
        let title = _.get(post, 'title', '');
        let content = _.get(post, 'content', '');
        let event_end = _.get(post, 'event_end', '');
        let type = _.get(post, 'type', '');
        let tag = _.get(post, 'tag', '');
        let is_incognito = _.get(post, 'is_incognito', false);

        let now = new Date(Date.now());

        let regex = /(<([^>]+)>)/ig;

        let entities = new Entities();
        let desPost = entities.decode(content.replace('>', '> ')
            .replace(regex, '')
            .replace('  ', ' ')
            .trim())
            .substring(0, 180);

        // console.log(user_data);

        new Models.Post({
            user_id: user_id,
            class_id: class_id,
            title: title,
            content: content,
            description: desPost,
            type: type,
            tag: tag,
            is_incognito: is_incognito,
            is_post_teacher: is_post_teacher,
            is_solve: false,
            created_at: now.toISOString()
        }).save().then(function (result) {
            result = result.toJSON();

            if (type == 'event') {
                new Models.EventExtend({
                    post_id: result.id,
                    time_end: event_end,
                    created_at: now.toISOString()
                }).save().then(function (event) {
                    result.time_end = event_end;
                    rep(ResponseJSON('Post success', result));

                    if (is_post_teacher == true && is_incognito == false) {
                        new Models.Class({
                            id: class_id
                        }).fetch().then(function (classSql) {
                            let dataPush = {
                                type: 'teacher_post',
                                title: title,
                                content: content,
                                teacher_name: user_name,
                                class_id: class_id,
                                class_name: classSql.toJSON().name
                            };
                            service.post.pushNotiToStudent(class_id, dataPush);
                            // console.log(dataPush);
                        });
                    }
                }).catch(function (err) {
                    return rep(Boom.badData('Something went wrong!'));
                });
            } else {
                rep(ResponseJSON('Post success', result));
                if (is_post_teacher == true && is_incognito == false) {
                    new Models.Class({
                        id: class_id
                    }).fetch().then(function (classSql) {
                        let dataPush = {
                            type: 'teacher_post',
                            title: title,
                            content: content,
                            teacher_name: user_name,
                            class_id: class_id,
                            class_name: classSql.toJSON().name
                        };
                        service.post.pushNotiToStudent(class_id, dataPush);
                        // console.log(dataPush);
                    });
                }
            }

        }).catch(function () {
            return rep(Boom.badData('Something went wrong!'));
        });
    },
    auth: {
        mode: 'required',
        strategies: ['jwt']
    },
    validate: {
        payload: {
            class_id: Joi.string().required(),
            title: Joi.string().required(),
            content: Joi.string().required(),
            type: Joi.string().required(),
            tag: Joi.string().optional(),
            is_incognito: Joi.boolean().optional(),
            event_end: Joi.string().optional()
        }
    },
    description: 'post a post to class',
    notes: 'post a post to class',
    tags: ['api', 'post']
};

module.exports.updatePost = {
    handler: function (req, rep) {
        let user_data = req.auth.credentials;
        let post = req.payload;
        let user_id = _.get(user_data, 'id', '');

        let post_id = _.get(post, 'post_id', 0);
        let title = _.get(post, 'title', '');
        let content = _.get(post, 'content', '');
        let is_incognito = _.get(post, 'is_incognito', false);
        let type = _.get(post, 'type', '');

        service.post.updatePost(user_id, post_id, title, content, is_incognito, type, function (err, res) {
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
            post_id: Joi.number().integer().required(),
            title: Joi.string().required(),
            content: Joi.string().required(),
            is_incognito: Joi.boolean().required(),
            type: Joi.string().required()
        }
    },
    description: 'update post',
    notes: 'update post',
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
            id: post_id
        }).fetch({
            withRelated: [
                'class',
                'votes.user',
                'comments.user',
                'user',
                'comments.votes.user',
                'comments.repComments.user',
                'event_extend',
                'attack_files'
            ]
        })
            .then(function (post) {
                post = post.toJSON();

                // xoa thong tin user khong can thiet cua post && cmt
                post.author = post.user;
                delete post.user;
                delete post.author.password;

                if (post.is_incognito == true && post.user_id != user_id) {
                    delete post.author;
                }

                let cmts = post.comments;
                for (var i = 0; i < cmts.length; i++) {
                    let tempCmt = cmts[i];
                    tempCmt.author = tempCmt.user;
                    delete tempCmt.user;
                    delete tempCmt.author.password;

                    // xoa thong tin user khong can thiet cua vote cmt
                    let votes = tempCmt.votes;
                    let vote_count = 0;
                    for (var j = 0; j < votes.length; j++) {
                        let tempVote = votes[j];
                        tempVote.author = tempVote.user;
                        delete tempVote.user;
                        delete tempVote.author.password;

                        // count vote
                        if (votes[j].up == true) {
                            vote_count++;
                        } else {
                            vote_count--;
                        }
                    }

                    tempCmt.vote_count = vote_count;

                    // xoa thong tin user khong can thiet cua rep cmt
                    let repCmts = tempCmt.repComments;
                    for (var j = 0; j < repCmts.length; j++) {
                        let tempRepCmt = repCmts[j];
                        tempRepCmt.author = tempRepCmt.user;
                        delete tempRepCmt.user;
                        delete tempRepCmt.author.password;
                    }
                }

                // xoa thong tin user khong can thiet cua vote
                let votes = post.votes;
                let vote_count = 0;
                for (var i = 0; i < votes.length; i++) {
                    let tempVote = votes[i];
                    tempVote.author = tempVote.user;
                    delete tempVote.user;
                    delete tempVote.author.password;

                    // count vote
                    if (votes[i].up == true) {
                        vote_count++;
                    } else {
                        vote_count--;
                    }
                }

                post.vote_count = vote_count;
                post.comment_count = cmts.length;

                // if event -> reformat
                if (post.type == 'event') {
                    post.time_end = post.event_extend.time_end;
                    post.attach_file_count = post.attack_files.length;
                }
                delete post.event_extend;

                delete post.attack_files;

                rep(ResponseJSON('', post));

                service.post.postSeenPost(post_id, user_id);
            }).catch(function (err) {
            rep(Boom.badData('Something went wrong!'));
            // console.log(err);
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
 * Post a seen-post
 */

module.exports.postSeen = {
    handler: function (req, rep) {
        let user_data = req.auth.credentials;
        let post = req.payload;
        let user_id = _.get(user_data, 'id', '');
        let post_id = _.get(post, 'post_id', '');

        new Models.Seen({
            user_id: user_id,
            post_id: post_id
        }).save().then(function (seen) {
            rep(ResponseJSON('', seen.toJSON()));
        }).catch(function (err) {
            rep(Boom.badData('Something went wrong!'));
        })
    },
    auth: {
        mode: 'required',
        strategies: ['jwt']
    },
    validate: {
        payload: {
            post_id: Joi.number().integer().required()
        }
    },
    description: 'post seen',
    notes: 'post seen',
    tags: ['api', 'post']
};

/**
 * post a cmt
 */

module.exports.postCmt = {
    handler: function (req, rep) {
        let user_data = req.auth.credentials;
        let post = req.payload;
        let user_id = _.get(user_data, 'id', '');
        let name = _.get(user_data, 'name', '');
        let post_id = _.get(post, 'post_id', '');
        let content = _.get(post, 'content', '');
        let isIncognito = _.get(post, 'is_incognito', false);

        let now = new Date(Date.now());

        new Models.Comment({
            user_id: user_id,
            post_id: post_id,
            content: content,
            is_solve: false,
            is_incognito: isIncognito,
            created_at: now.toISOString()
        }).save().then(function (result) {
            if (result) {
                new Models.Comment({
                    id: result.toJSON().id
                }).fetch({withRelated: ['user', 'post.user']}).then(function (cmtSql) {
                    cmtSql = cmtSql.toJSON();
                    cmtSql.author = cmtSql.user;
                    delete cmtSql.user;
                    delete cmtSql.author.password;

                    rep(ResponseJSON('Comment success!', cmtSql));

                    let regex = /(<([^>]+)>)/ig;
                    let entities = new Entities();
                    let desCmt = entities.decode(content.replace('>', '> ')
                        .replace(regex, '')
                        .replace('  ', ' ')
                        .trim())
                        .substring(0, 180);

                    // push noti to post's owner
                    let dataPush = {
                        type: 'comment',
                        post_id: post_id,
                        content: desCmt,
                        name: name,
                        is_incognito: isIncognito
                    };

                    if (isIncognito) {
                        delete dataPush.name;
                    }

                    let ownerPost_id = cmtSql.post.user.id;

                    if (user_id != ownerPost_id) {
                        service.post.pushNotiToPostOwner(post_id, dataPush);
                    }
                });
            }
        }).catch(function (err) {
            console.log(err);
            rep(Boom.badData('Something went wrong!'));
        });
    },
    auth: {
        mode: 'required',
        strategies: ['jwt']
    },
    validate: {
        payload: {
            post_id: Joi.number().integer().required(),
            content: Joi.string().required(),
            is_incognito: Joi.boolean().optional()
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
    handler: function (req, rep) {
        let user_data = req.auth.credentials;
        let post = req.payload;
        let user_id = _.get(user_data, 'id', '');
        let post_id = _.get(post, 'post_id', '');
        let content = _.get(post, 'content', '');

        let up = (content > 0);

        if (content == 0) {
            new Models.Vote({
                user_id: user_id,
                post_id: post_id
            }).fetch().then(function (result) {
                if (_.isEmpty(result)) {
                    return rep(Boom.badData('destroy fail'));
                }
                new Models.Vote({id: result.id}).destroy().then(function () {
                    // console.log('destroy ok');
                    // console.log(result.toJSON());
                    service.post.getVotePost(post_id, function (vote_count) {
                        let res = {
                            vote_count: vote_count
                        };
                        return rep(ResponseJSON('Success', res));
                    });
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
                    }).save({up: up}, {method: 'update', patch: true}).then(function (result) {
                        // console.log('update ok men');
                        // console.log(result.toJSON());
                        // return rep(ResponseJSON('Success', result.toJSON()));
                        service.post.getVotePost(post_id, function (vote_count) {
                            let res = {
                                vote_count: vote_count
                            };
                            return rep(ResponseJSON('Success', res));
                        });
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
                    user_id: user_id,
                    post_id: post_id,
                    up: up,
                    type: 'post'
                }).save(null, {method: 'insert'}).then(function (result) {
                    // console.log('insert ok');
                    // console.log(result.toJSON());
                    // return rep(ResponseJSON('Success', result.toJSON()));
                    service.post.getVotePost(post_id, function (vote_count) {
                        let res = {
                            vote_count: vote_count
                        };
                        return rep(ResponseJSON('Success', res));
                    });
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
            post_id: Joi.number().integer().required(),
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

module.exports.postVoteCmt = {
    handler: function (req, rep) {
        let user_data = req.auth.credentials;
        let post = req.payload;
        let user_id = _.get(user_data, 'id', '');
        let comment_id = _.get(post, 'comment_id', '');

        // let content = _.get(post, 'content', '');
        service.post.postVoteCmt(1, comment_id, user_id, function (err, res) {
            if (!err) {
                return rep(ResponseJSON('Success', res));
            } else {
                return rep(Boom.badData('Something went wrong!'));
            }
        });
    },
    auth: {
        mode: 'required',
        strategies: ['jwt']
    },
    validate: {
        payload: {
            comment_id: Joi.number().integer().required()
            // content: Joi.number().integer().required()
        }
    },
    description: 'post vote cmt',
    notes: 'post vote cmt',
    tags: ['api', 'post', 'vote']
};

module.exports.postDeVoteCmt = {
    handler: function (req, rep) {
        let user_data = req.auth.credentials;
        let post = req.payload;
        let user_id = _.get(user_data, 'id', '');
        let comment_id = _.get(post, 'comment_id', '');

        // let content = _.get(post, 'content', '');
        service.post.postVoteCmt(-1, comment_id, user_id, function (err, res) {
            if (!err) {
                return rep(ResponseJSON('Success', res));
            } else {
                return rep(Boom.badData('Something went wrong!'));
            }
        });
    },
    auth: {
        mode: 'required',
        strategies: ['jwt']
    },
    validate: {
        payload: {
            comment_id: Joi.number().integer().required()
            // content: Joi.number().integer().required()
        }
    },
    description: 'post vote cmt',
    notes: 'post vote cmt',
    tags: ['api', 'post', 'vote']
};

module.exports.postUnVoteCmt = {
    handler: function (req, rep) {
        let user_data = req.auth.credentials;
        let post = req.payload;
        let user_id = _.get(user_data, 'id', '');
        let comment_id = _.get(post, 'comment_id', '');

        // let content = _.get(post, 'content', '');
        service.post.postVoteCmt(0, comment_id, user_id, function (err, res) {
            if (!err) {
                return rep(ResponseJSON('Success', res));
            } else {
                return rep(Boom.badData('Something went wrong!'));
            }
        });
    },
    auth: {
        mode: 'required',
        strategies: ['jwt']
    },
    validate: {
        payload: {
            comment_id: Joi.number().integer().required()
            // content: Joi.number().integer().required()
        }
    },
    description: 'post vote cmt',
    notes: 'post vote cmt',
    tags: ['api', 'post', 'vote']
};

/**
 * Owner tick solved to cmt
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

                if (user_id == tempPost.user_id) {
                    // tick solve to post
                    service.post.solvePost(tempPost.id, true);

                    //find the cmt is solve and remove solve from it
                    let cmts = tempPost.comments;
                    let cmtIdSolve = 0;
                    for (let i = 0; i < cmts.length; i++) {
                        let tempCmt = cmts[i];
                        if (tempCmt.is_solve > 0) {
                            cmtIdSolve = tempCmt.id;
                            break;
                        }
                    }

                    if (cmtIdSolve != 0) {
                        new Models.Comment({id: cmtIdSolve})
                            .save({is_solve: false}, {method: 'update', patch: true})
                            .then(function () {
                                new Models.Comment({id: comment_id})
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

                    new Models.Comment({id: comment_id})
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
            comment_id: Joi.number().integer().required()
        }
    },
    description: 'post solve',
    notes: 'post solve',
    tags: ['api', 'post', 'solve']
};


/**
 * Owner un-tick solved to cmt
 */
module.exports.postUnSolve = {
    handler: function (req, rep) {
        let user_data = req.auth.credentials;
        let user_id = _.get(user_data, 'id', '');
        let post = req.payload;
        let comment_id = _.get(post, 'comment_id', '');

        new Models.Comment({id: comment_id}).fetch({withRelated: ['post']})
            .then(function (result) {
                result = result.toJSON();
                let tempPost = result.post;

                if (user_id == tempPost.user_id) {
                    // un tick solve to post
                    service.post.solvePost(tempPost.id, false);

                    new Models.Comment({id: comment_id})
                        .save({is_solve: false}, {method: 'update', patch: true})
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
            comment_id: Joi.number().integer().required()
        }
    },
    description: 'post unsolve',
    notes: 'post unsolve',
    tags: ['api', 'post', 'unsolve']
};

/**
 * get all rep comment
 * method : GET
 * param: comment_id
 */
module.exports.getRepComments = {
    handler: function (req, rep) {
        let cmtId = encodeURIComponent(req.params.comment_id);

        new Models.Comment({
            id: cmtId
        }).fetch({withRelated: 'repComments.user'}).then(function (cmt) {
            cmt = cmt.toJSON();
            let repCmts = cmt.repComments;
            for (var i = 0; i < repCmts.length; i++) {
                let repCmt = repCmts[i];
                repCmt.author = repCmt.user;
                delete repCmt.user;
                delete repCmt.author.password;
                delete repCmt.author.token_id;
                if (repCmt.is_incognito == true) {
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
    handler: function (req, rep) {
        let user_data = req.auth.credentials;
        let post = req.payload;
        let userId = _.get(user_data, 'id', '');
        let commentId = _.get(post, 'comment_id', '');
        let content = _.get(post, 'content', '');
        let isIncognito = _.get(post, 'is_incognito', false);

        new Models.RepComment({
            comment_id: commentId,
            user_id: userId,
            content: content,
            is_incognito: isIncognito
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
    validate: {
        payload: {
            comment_id: Joi.number().integer().required(),
            content: Joi.string().required(),
            is_incognito: Joi.boolean().optional()
        }
    },
    description: 'post rep comments',
    notes: 'post rep comments',
    tags: ['api', 'post', 'post cmt']
};

module.exports.deleteCmt = {
    handler: function (req, rep) {
        let user_data = req.auth.credentials;
        let post = req.payload;
        let userId = _.get(user_data, 'id', '');
        let commentId = _.get(post, 'comment_id', '');

        new Models.Comment({
            id: commentId
        }).fetch().then(function (cmt) {
            cmt = cmt.toJSON();

            if (cmt.user_id != userId) {
                return rep(Boom.unauthorized('You are not the author'));
            }

            new Models.Comment({
                id: commentId
            }).destroy().then(function (cmtDelete) {
                rep(ResponseJSON('Delete cmt success!', cmtDelete));
            });
        }).catch(function (err) {
            rep(Boom.badData('Something went wrong!'));
        });
    },
    auth: {
        mode: 'required',
        strategies: ['jwt']
    },
    validate: {
        payload: {
            comment_id: Joi.number().integer().required()
        }
    },
    description: 'post rep comments',
    notes: 'post rep comments',
    tags: ['api', 'post', 'post cmt']
};

module.exports.deletePost = {
    handler: function (req, rep) {
        let user_data = req.auth.credentials;
        let post = req.payload;
        let userId = _.get(user_data, 'id', '');
        let post_id = _.get(post, 'post_id', '');

        new Models.Post({
            id: post_id
        }).fetch().then(function (post) {
            post = post.toJSON();

            if (post.user_id != userId) {
                return rep(Boom.unauthorized('You are not the author'));
            } else {
                service.post.deletePost(post_id, function (err) {
                    if (!err) {
                        rep(ResponseJSON('Success'));
                    } else {
                        rep(Boom.badData('Something went wrong!'));
                    }
                })
            }
        }).catch(function (err) {
            rep(Boom.badData('Something went wrong!'));
        });
    },
    auth: {
        mode: 'required',
        strategies: ['jwt']
    },
    validate: {
        payload: {
            post_id: Joi.number().integer().required()
        }
    },
    description: 'delete post',
    notes: 'delete post',
    tags: ['api', 'post', 'delete post']
};

/**
 * Post/attack a image
 * @return linkImg : String
 */

module.exports.uploadImage = {
    handler: function (req, rep) {
        let user_data = req.auth.credentials;
        let user_id = _.get(user_data, 'id', '');
        let user_code = _.get(user_data, 'code', '');
        let data = req.payload;

        if (data.file) {
            let file = data.file;

            service.file.saveFileAndGetStaticURL(file, user_code, function (err, res) {
                if (!err) {
                    rep(ResponseJSON('Upload success!', res));

                    // save to db
                    new Models.AttackFile({
                        user_id: user_id,
                        type: 'image',
                        url: res.url
                    }).save();
                } else {
                    rep(Boom.badData('Something went wrong!'));
                }
            });
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

module.exports.postSupport = {
    handler: function (req, rep) {
        // let user_data = req.auth.credentials;
        let post = req.payload;
        let email = _.get(post, 'email', '');
        let type = _.get(post, 'type', '');
        let content = _.get(post, 'content', '');

        let now = new Date(Date.now());

        new Models.Support({
            email: email,
            type: type,
            content: content,
            created_at: now.toISOString()
        }).save().then((result)=> {
            rep(ResponseJSON('Post support msg success!', result));
        }).catch(()=> {
            rep(Boom.badData('Something went wrong!'));
        });
    },
    auth: false,
    validate: {
        payload: {
            email: Joi.string().optional(),
            type: Joi.string().required(),
            content: Joi.string().required()
        }
    },
    description: 'post report',
    notes: 'post report',
    tags: ['api', 'post', 'post report']
};

module.exports.upFileToEvent = {
    handler: function (req, rep) {
        let user_data = req.auth.credentials;
        let user_id = _.get(user_data, 'id', '');
        let user_code = _.get(user_data, 'code', '');
        let post_id = encodeURIComponent(req.params.post_id);
        let data = req.payload;

        if (data.file) {
            let file = data.file;

            service.file.saveFileEventAndGetStaticURL(file, post_id, user_code, function (err, res) {
                if (!err) {
                    rep(ResponseJSON('Upload success!', res));

                    // save to db
                    new Models.AttackFile({
                        post_id: post_id,
                        user_id: user_id,
                        type: _.get(res.headers, 'content-type', 'file'),
                        url: res.url
                    }).save();
                } else {
                    rep(Boom.badData('Something went wrong!'));
                }
            });
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
        maxBytes: 20097152,
        allow: 'multipart/form-data',
        parse: true
    },
    description: 'posadft event',
    notes: 'post a',
    tags: ['api', 'adfadf']
};

module.exports.checkEvent = {
    handler: function (req, rep) {
        let user_data = req.auth.credentials;
        let user_id = _.get(user_data, 'id', '');
        // let capability = _.get(user_data, 'capability', '');
        // let is_teacher = (capability == 'teacher');
        let post_id = encodeURIComponent(req.params.post_id);

        new Models.Post({
            id : post_id
        }).fetch({withRelated: ['event_extend', 'attack_files.user']}).then(function (post) {

        })

    },
    auth: {
        mode: 'required',
        strategies: ['jwt']
    },
    description: 'post report',
    notes: 'post report',
    tags: ['api', 'post', 'post report']
};