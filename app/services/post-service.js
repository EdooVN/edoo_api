'use strict';

const _ = require('lodash');
const knex = require('../../config/bookshelft').knex;
const async = require("async");
const request = require('request');
const jwt = require('jsonwebtoken');
const mkdirp = require('mkdirp');
const fs = require('fs');
const Entities = require('html-entities').AllHtmlEntities;
const Models = global.Models;
const helpers = global.helpers;
const config = helpers.config;

const API_FIREBASE_KEY = config('API_FIREBASE_KEY', '');
const SERVER_KEY = config('SERVER_KEY', 'server_key');

const TYPE_POST_ARR = helpers.commons.TYPE_POST_ARRAY;

module.exports.getPostInPage = function (pageNumber, pageSize, class_id, user_id, cb) {
    new Models.Post()
        .query(function (qb) {
            qb.where('class_id', '=', class_id);
        })
        .orderBy('-created_at')
        .fetchPage({
            page: pageNumber,
            pageSize: pageSize,
            withRelated: ['user', 'comments', 'votes', 'event_extend']
        })
        .then(function (result) {
            let pagination = _.get(result, 'pagination', '');

            result = result.toJSON();
            let posts = result;

            for (var i = 0; i < posts.length; i++) {
                let post = posts[i];
                posts[i].author = posts[i].user;
                delete posts[i].user;
                delete posts[i].author.password;

                let cmts = post.comments;
                post.comment_count = cmts.length;
                post.is_solve = 0;
                for (let j = 0; j < cmts.length; j++) {
                    let cmt = cmts[j];
                    if (cmt.is_solve == true) {
                        post.is_solve = 1;
                        break;
                    }
                }
                delete post.comments;

                let votes = post.votes;
                let vote_count = 0;
                for (let j = 0; j < votes.length; j++) {
                    if (votes[j].up == true) {
                        vote_count++;
                    } else {
                        vote_count--;
                    }
                }

                post.vote_count = vote_count;
                delete post.votes;

                // console.log(post);

                if (post.is_incognito == true && post.user_id != user_id) {
                    delete post.author;
                }

                // if event -> reformat
                if (post.type == 'event') {
                    post.time_end = post.event_extend.time_end;
                }
                delete post.event_extend;
            }

            checkUserSeen(result, user_id, function (posts) {
                // result = posts;
                let res = {
                    class_id: class_id,
                    posts: posts,
                    pagination: pagination
                };

                addClassInfo(res, class_id, function (err, resWithClassInfo) {
                    if (!err) {
                        cb(false, resWithClassInfo);
                    } else {
                        cb(true);
                    }
                });
            });
        }).catch(function (err) {
        cb(true);
    });
};


/**
 *  get post with filter
 */

module.exports.getPostInPageFilterTeacher = function (pageNumber, pageSize, class_id, user_id, cb) {
    new Models.Post()
        .query(function (qb) {
            qb.where('class_id', '=', class_id)
                .andWhere('is_post_teacher', '=', true)
                .andWhere('is_incognito', '=', false);
        })
        .orderBy('-created_at')
        .fetchPage({
            page: pageNumber,
            pageSize: pageSize,
            withRelated: ['user', 'comments', 'votes', 'event_extend']
        })
        .then(function (result) {
            let pagination = _.get(result, 'pagination', '');

            result = result.toJSON();
            let posts = result;

            for (var i = 0; i < posts.length; i++) {
                let post = posts[i];
                posts[i].author = posts[i].user;
                delete posts[i].user;
                delete posts[i].author.password;

                let cmts = post.comments;
                post.comment_count = cmts.length;
                post.is_solve = 0;
                for (let j = 0; j < cmts.length; j++) {
                    let cmt = cmts[j];
                    if (cmt.is_solve == true) {
                        post.is_solve = 1;
                        break;
                    }
                }
                delete post.comments;

                let votes = post.votes;
                let vote_count = 0;
                for (let j = 0; j < votes.length; j++) {
                    if (votes[j].up == true) {
                        vote_count++;
                    } else {
                        vote_count--;
                    }
                }

                post.vote_count = vote_count;
                delete post.votes;

                // console.log(post);

                if (post.is_incognito == true && post.user_id != user_id) {
                    delete post.author;
                }

                // if event -> reformat
                if (post.type == 'event') {
                    post.time_end = post.event_extend.time_end;
                }
                delete post.event_extend;
            }

            checkUserSeen(result, user_id, function (posts) {
                // result = posts;
                let res = {
                    class_id: class_id,
                    posts: posts,
                    pagination: pagination
                };
                addClassInfo(res, class_id, function (err, resWithClassInfo) {
                    if (!err) {
                        cb(false, resWithClassInfo);
                    } else {
                        cb(true);
                    }
                });
            });
        }).catch(function (err) {
        cb(true);
    });
};

/**
 *  get post with filter
 */

module.exports.getPostInPageFilterSolve = function (pageNumber, pageSize, class_id, user_id, cb) {
    new Models.Post()
        .query(function (qb) {
            qb.where('class_id', '=', class_id)
                .andWhere('type', '=', 'question')
                .andWhere('is_solve', '=', false)
                .andWhere('is_post_teacher', '=', false);
        })
        .orderBy('-created_at')
        .fetchPage({
            page: pageNumber,
            pageSize: pageSize,
            withRelated: ['user', 'comments', 'votes']
        })
        .then(function (result) {
            let pagination = _.get(result, 'pagination', '');

            result = result.toJSON();
            let posts = result;

            for (var i = 0; i < posts.length; i++) {
                let post = posts[i];
                posts[i].author = posts[i].user;
                delete posts[i].user;
                delete posts[i].author.password;

                let cmts = post.comments;
                post.comment_count = cmts.length;
                post.is_solve = 0;
                for (let j = 0; j < cmts.length; j++) {
                    let cmt = cmts[j];
                    if (cmt.is_solve == true) {
                        post.is_solve = 1;
                        break;
                    }
                }
                delete post.comments;

                let votes = post.votes;
                let vote_count = 0;
                for (let j = 0; j < votes.length; j++) {
                    if (votes[j].up == true) {
                        vote_count++;
                    } else {
                        vote_count--;
                    }
                }

                post.vote_count = vote_count;
                delete post.votes;

                // console.log(post);

                if (post.is_incognito == true && post.user_id != user_id) {
                    delete post.author;
                }
            }

            checkUserSeen(result, user_id, function (posts) {
                // result = posts;
                let res = {
                    class_id: class_id,
                    posts: posts,
                    pagination: pagination
                };
                addClassInfo(res, class_id, function (err, resWithClassInfo) {
                    if (!err) {
                        cb(false, resWithClassInfo);
                    } else {
                        cb(true);
                    }
                });
            });
        }).catch(function (err) {
        cb(true);
    });
};

/**
 *  get post with filter
 */

module.exports.getPostInPageFilterNotSeen = function (pageNumber, pageSize, class_id, user_id, cb) {
    new Models.Post()
        .query(function (qb) {
            // qb.innerJoin('seens', 'posts.id', 'seens.post_id');
            let subQuery = knex('seens').where('seens.user_id', '=', user_id).select('post_id');
            qb.where('posts.class_id', '=', class_id)
                .andWhere('posts.id', 'not in', subQuery);
            qb.groupBy('posts.id');
        })
        .orderBy('-created_at')
        .fetchPage({
            page: pageNumber,
            pageSize: pageSize,
            withRelated: ['user', 'comments', 'votes', 'event_extend']
        })
        .then(function (result) {
            let pagination = _.get(result, 'pagination', '');

            result = result.toJSON();
            let posts = result;

            for (var i = 0; i < posts.length; i++) {
                let post = posts[i];
                posts[i].author = posts[i].user;
                delete posts[i].user;
                delete posts[i].author.password;

                let cmts = post.comments;
                post.comment_count = cmts.length;
                post.is_solve = 0;
                for (let j = 0; j < cmts.length; j++) {
                    let cmt = cmts[j];
                    if (cmt.is_solve == true) {
                        post.is_solve = 1;
                        break;
                    }
                }
                delete post.comments;

                let votes = post.votes;
                let vote_count = 0;
                for (let j = 0; j < votes.length; j++) {
                    if (votes[j].up == true) {
                        vote_count++;
                    } else {
                        vote_count--;
                    }
                }

                post.vote_count = vote_count;
                delete post.votes;

                // console.log(post);

                if (post.is_incognito == true && post.user_id != user_id) {
                    delete post.author;
                }

                // if event -> reformat
                if (post.type == 'event') {
                    post.time_end = post.event_extend.time_end;
                }
                delete post.event_extend;
            }

            checkUserSeen(result, user_id, function (posts) {
                // result = posts;
                let res = {
                    class_id: class_id,
                    posts: posts,
                    pagination: pagination
                };
                addClassInfo(res, class_id, function (err, resWithClassInfo) {
                    if (!err) {
                        cb(false, resWithClassInfo);
                    } else {
                        cb(true);
                    }
                });
            });
        }).catch(function (err) {
        cb(true);
    });
};

function addClassInfo(input, class_id, cb) {
    new Models.Class({
        id: class_id
    }).fetch().then(function (classSql) {
        classSql = classSql.toJSON();
        input.class_id = class_id;
        input.code = classSql.code;
        input.name = classSql.name;
        input.type = classSql.type;
        input.semester = classSql.semester;
        input.credit_count = classSql.credit_count;
        input.student_count = classSql.student_count;
        input.teacher_name = classSql.teacher_name;
        return cb(false, input);
    }).catch(function (err) {
        return cb(true);
    })
}

module.exports.getVotePost = getVotePost;
function getVotePost(post_id, callback) {
    new Models.Post({
        id: post_id
    }).fetch({withRelated: 'votes'}).then(function (post) {
        if (_.isEmpty(post)) {
            callback(0);
        }
        post = post.toJSON();
        let votes = post.votes;

        let vote_count = 0;
        for (var i = 0; i < votes.length; i++) {
            let vote = votes[i];
            if (vote.up == true) {
                vote_count++;
            } else {
                vote_count--;
            }
        }

        callback(vote_count);
    });
}

module.exports.getSolveCount = function (user_id, cb) {
    let res = {
        solve_count: 0,
        vote_count: 0
    };
    let solveCount = 0;
    let voteCount = 0;
    new Models.User({
        id: user_id
    }).fetch({withRelated: ['comments', 'posts']}).then(function (user) {
        user = user.toJSON();
        let cmts = user.comments;
        for (let i = 0; i < cmts.length; i++) {
            let cmt = cmts[i];
            if (cmt.is_solve == true) {
                solveCount++;
            }
        }

        let posts = user.posts;
        async.each(posts,
            function (post, callback) {
                getVotePost(post.id, function (tempVoteCount) {
                    voteCount += tempVoteCount;
                    callback();
                });
            },
            function (err) {
                // when done, call back to rep
                res.solve_count = solveCount;
                res.vote_count = voteCount;
                cb(res);
            })
    });
};

module.exports.solvePost = function (post_id, is_solve, cb) {
    new Models.Post({
        id: post_id
    }).save({is_solve: is_solve}, {method: 'update', patch: true}).then(function (result) {
        if (cb) {
            cb();
        }
    });
};

module.exports.postSeenPost = function (post_id, user_id, cb) {
    new Models.Seen({
        user_id: user_id,
        post_id: post_id
    }).fetch().then(function (seen) {
        if (_.isEmpty(seen)) {
            new Models.Seen({
                user_id: user_id,
                post_id: post_id
            }).save().then(function (seen) {
                if (cb) {
                    cb(false);
                }
            })
        }
    }).catch(function (err) {
        if (cb) {
            cb(true);
        }
    })
};


module.exports.checkUserSeen = checkUserSeen;

function checkUserSeen(posts, user_id, cb) {
    if (_.isEmpty(posts)) {
        return cb(posts);
    }

    async.each(posts,
        function (post, callback) {
            let is_seen = 0;
            new Models.Post({
                id: post.id
            }).fetch({withRelated: 'seens'}).then(function (postSql) {
                if (!_.isEmpty(postSql)) {
                    postSql = postSql.toJSON();
                    let seens = postSql.seens;
                    for (var i = 0; i < seens.length; i++) {
                        let seen = seens[i];
                        if (seen.user_id == user_id) {
                            is_seen = 1;
                        }
                    }
                }
                post.is_seen = is_seen;

                callback();
            }).catch(function (err) {
                console.log(err);
                callback();
            });
        },

        function (err) {
            // when done, call back to rep
            cb(posts);
        });
}

module.exports.pushNotiToStudent = function (classId, data) {
    new Models.Class({
        id: classId
    }).fetch({withRelated: 'users.firebase_tokens'}).then(function (classSql) {
        classSql = classSql.toJSON();
        let users = classSql.users;
        for (var i = 0; i < users.length; i++) {
            let user = users[i];
            if (user.capability == 'student') {
                let firebaseTokens = user.firebase_tokens;
                for (var j = 0; j < firebaseTokens.length; j++) {
                    let firebaseToken = firebaseTokens[j];
                    if (firebaseToken.type == 'android') {
                        pushFirebaseNoti(API_FIREBASE_KEY, firebaseToken.token, data);
                        console.log(API_FIREBASE_KEY);
                        console.log(firebaseToken.token);
                        console.log(data);

                    }
                }
            }
        }

    }).catch(function (err) {
        console.log(err);
    });
};

module.exports.pushNotiToPostOwner = function (post_id, data) {
    new Models.Post({
        id: post_id
    }).fetch({withRelated: 'user.firebase_tokens'})
        .then(function (postSql) {
            postSql = postSql.toJSON();

            let firebaseTokens = postSql.user.firebase_tokens;
            for (var j = 0; j < firebaseTokens.length; j++) {
                let firebaseToken = firebaseTokens[j];
                if (firebaseToken.type == 'android') {
                    pushFirebaseNoti(API_FIREBASE_KEY, firebaseToken.token, data);
                }
            }
        });
};

function pushFirebaseNoti(apiKey, deviceToken, data) {
    // console.log('api key: ' + apiKey);
    // console.log('device: ' + deviceToken);

    let urlReq = 'https://fcm.googleapis.com/fcm/send';

    let form = {
        to: deviceToken,
        // "notification": {
        //     "body": "This week's edition is now available.",
        //     "title": "NewsMagazine.com",
        //     "icon": "new"
        // },
        data: data
    };

    let authorHeader = 'key=' + apiKey;
    let param_post = {
        url: urlReq,
        headers: {
            'Authorization': authorHeader,
            'Content-Type': 'application/json'
        },
        form: form
    };

    request.post(param_post, function (err, response, body) {
        console.log(err);
        console.log(response);
    });
}

// module.exports.saveImgAndGetStaticURL = function (file, user_code, cb) {
//     let name = filje.hapi.filename;
//     var savePath = config('PATH_IMG_UPLOAD', '/');
//     let serverName = config('SERVER_STATIC_FILES', 'http://media.uetf.me');
//     let timeNow = new Date(Date.now());
//     let zenPath = '/' + user_code + '/' + timeNow.getTime();
//     savePath = savePath + '/' + zenPath;
//     var path = savePath + '/' + name;
//
//     mkdirp(savePath, function (err) {
//         if (err) {
//             console.error(err);
//             // rep(Boom.badData('Something went wrong!'));
//             cb(true);
//         } else {
//             var newFile = fs.createWriteStream(path);
//
//             newFile.on('error', function (err) {
//                 console.error(err);
//                 // rep(Boom.badData('Something went wrong!'));
//                 cb(true);
//             });
//
//             file.pipe(newFile);
//
//             file.on('end', function (err) {
//                 var res = {
//                     filename: file.hapi.filename,
//                     headers: file.hapi.headers,
//                     path: path,
//                     url: (serverName + zenPath + '/' + encodeURI(name))
//                 };
//                 // rep(ResponseJSON('Upload success!', res));
//                 cb(false, res);
//             })
//         }
//     });
// };

module.exports.deletePost = function (post_id, cb) {
    new Models.Post({
        id: post_id
    }).destroy().then(function (post) {
        deleteCmtInPost(post_id);

        if (cb) {
            cb(false);
        }
    }).catch(function (err) {
        if (cb) {
            cb(true);
        }
    })
};

function deleteCmtInPost(post_id, cb) {
    knex('comments').where('post_id', post_id).del()
        .then(function () {
        });
}

module.exports.postVoteCmt = function (content, comment_id, user_id, cb) {
    let up = (content > 0);
    if (content == 0) {
        new Models.Vote({
            user_id: user_id,
            comment_id: comment_id
        }).fetch().then(function (result) {
            if (_.isEmpty(result)) {
                return cb(true);
            }
            new Models.Vote({id: result.id}).destroy().then(function () {
                // console.log('destroy ok');
                // console.log(result.toJSON());

                countVoteCmt(comment_id, function (err, vote_count) {
                    if (!err) {
                        result = result.toJSON();
                        result.vote_count = vote_count;
                        result.comment_id = comment_id;

                        return cb(false, result);
                    } else {
                        throw new Error();
                    }
                });
            }).catch(function () {
                console.log('destroy fail');
                return cb(true);
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
                }).save({up: up}, {method: 'update', patch: true}).then(function (result) {
                    // console.log('update ok men');
                    // console.log(result.toJSON());

                    countVoteCmt(comment_id, function (err, vote_count) {
                        if (!err) {
                            result = result.toJSON();
                            result.vote_count = vote_count;
                            result.comment_id = comment_id;

                            return cb(false, result);
                        } else {
                            throw new Error();
                        }
                    });
                    // return cb(false, result.toJSON());
                }).catch(function () {
                    // console.log('update fail');
                    return cb(true);
                })
            }
        }).catch(function (err) {
            // add new
            // console.log('loi cmnr');
            // console.log(err);

            new Models.Vote({
                user_id: user_id,
                comment_id: comment_id,
                up: up,
                type: 'comment'
            }).save().then(function (result) {
                // console.log('insert ok');
                // console.log(result.toJSON());
                countVoteCmt(comment_id, function (err, vote_count) {
                    if (!err) {
                        result = result.toJSON();
                        result.vote_count = vote_count;
                        result.comment_id = comment_id;

                        return cb(false, result);
                    } else {
                        throw new Error();
                    }
                });
                // return cb(false, result.toJSON());
            }).catch(function () {
                // console.log('insert fail');
                return cb(true);
            });
        });
    }
};


function countVoteCmt(comment_id, cb) {
    new Models.Vote()
        .where('comment_id', '=', comment_id)
        .fetchAll()
        .then(function (votes) {
            votes = votes.toJSON();

            let vote_count = 0;
            for (let i = 0; i < votes.length; i++) {
                let vote = votes[i];
                if (vote.up == true) {
                    vote_count++;
                } else {
                    vote_count--;
                }
            }

            cb(false, vote_count);

        }).catch(function () {
        cb(true);
    })
}

module.exports.updatePost = function (user_id, post_id, title, content, is_incognito, type, event_end, cb) {
    if (!isValidTypePost(type)) {
        return cb(true, 'Type post is invalided');
    }

    new Models.Post({
        id: post_id
    }).fetch({withRelated: 'user'})
        .then(function (postResult) {
            if (_.isEmpty(postResult)) {
                return cb(true, 'Post id is not existed');
            }

            postResult = postResult.toJSON();

            if (user_id != postResult.user.id) {
                return cb(true, 'You are not the author');
            }

            let regex = /(<([^>]+)>)/ig;

            let entities = new Entities();
            let desPost = entities.decode(content.replace('>', '> ')
                .replace(regex, '')
                .replace('  ', ' ')
                .trim())
                .substring(0, 180);

            new Models.Post({
                id: post_id
            }).save({
                title: title,
                description: desPost,
                content: content,
                is_incognito: is_incognito,
                type: type
            }, {method: 'update', patch: true})
                .then(function (postUpdateSql) {
                    if (type == 'event') {
                        knex('event_extend')
                            .where('post_id', '=', post_id)
                            .update({
                                time_end: event_end
                            }).then(function () {

                            return cb(false, postUpdateSql);
                        }).catch(function (err) {
                            return cb(true, 'Something went wrong');
                        });
                    } else {
                        return cb(false, postUpdateSql);
                    }
                });
        })
        .catch(function () {
            return cb(true, 'Something went wrong');
        });
};

function isValidTypePost(typePost) {
    for (let type of TYPE_POST_ARR) {
        if (typePost == type) {
            return true;
        }
    }

    return false;
}