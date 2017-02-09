'use strict';

const _ = require('lodash');
const bcrypt = require('bcrypt');
const async = require('async');
const knex = require('../../config/bookshelft').knex;
const Models = global.Models;
const commons = global.helpers.commons;
const jwt = require('jsonwebtoken');
const postService = require('./post-service');
const emailService = require('./email-service');
const fileService = require('./file-service');
const studentInfoService = require('./student-info-service');

let config = global.helpers.config;
const SERVER_KEY = config('SERVER_KEY', '');
const POINT_SOLVE_PER_COMMENT = commons.POINT_SOLVE_PER_COMMENT;
const POINT_VOTE_PER_POST = commons.POINT_VOTE_PER_POST;

module.exports.getUserInfo = function (user_id, cb) {
    new Models.User({
        id: user_id
    }).fetch().then(function (userSql) {
        userSql = userSql.toJSON();

        delete userSql.password;

        addUserDetail(userSql, user_id, function (userDetail) {
            postService.getSolveCount(user_id, function (solveVoteInfo) {
                let solve_count = solveVoteInfo.solve_count;
                let vote_count = solveVoteInfo.vote_count;

                let pointCount = (solve_count * POINT_SOLVE_PER_COMMENT) + (vote_count * POINT_VOTE_PER_POST);

                userDetail.point_count = pointCount;
                cb(userDetail);
            });
        });
    });
};

function addUserDetail(userInfo, user_id, cb) {
    userInfo.description = '';
    userInfo.favorite = '';
    new Models.UserDetail({
        user_id: user_id
    }).fetch().then(function (user_detail) {
        if (_.isEmpty(user_detail)) {
            return cb(userInfo);
        } else {
            user_detail = user_detail.toJSON();
            if (!_.isEmpty(user_detail.description)) {
                userInfo.description = user_detail.description;
            }
            if (!_.isEmpty(user_detail.favorite)) {
                userInfo.favorite = user_detail.favorite;
            }

            return cb(userInfo);
        }
    }).catch(function (err) {
        return cb(userInfo);
    });
}

module.exports.updateUserProfile = function (user_id, favorite, description, cb) {
    let dataUpdate = {};
    if (!_.isEmpty(favorite)) {
        dataUpdate.favorite = favorite;
    }
    if (!_.isEmpty(description)) {
        dataUpdate.description = description;
    }

    new Models.UserDetail({
        user_id: user_id
    }).fetch().then(function (user) {
        if (!_.isEmpty(user)) {
            user = user.toJSON();
            new Models.UserDetail({
                id: user.id,
            }).save(dataUpdate, {method: 'update', patch: true})
                .then(function (userDetail) {
                    cb(userDetail);
                })
        } else {
            new Models.UserDetail({
                user_id: user_id,
                favorite: favorite,
                description: description
            }).save().then(function (userSave) {
                cb(userSave);
            })
        }
    })
};

module.exports.updateToken = function (tokenId) {
    // console.log(tokenId);
    new Models.Token({
        id: tokenId
    }).save(
        {time_expire: (Date.now() + commons.timeExtension)},
        {method: 'update', patch: true})
};

module.exports.getTokenUser = getTokenUser;

function getTokenUser(user, callback) {
    let tokenUser = jwt.sign(user, SERVER_KEY);
    callback(tokenUser);
}

module.exports.saveNewToken = saveNewToken;

function saveNewToken(userData, cb) {
    new Models.Token({
        user_id: userData.id,
        time_expire: (Date.now() + commons.timeExtension)
    }).save().then(function (tokenSql) {
        let tokenId = tokenSql.get('id');
        userData.token_id = tokenId;

        getTokenUser(userData, function (tokenUser) {
            delete userData.password;
            delete userData.token_id;

            return cb(false, {token: tokenUser, user: userData});
        });

    }).catch(function (err) {
        console.log(err);
        return cb(true);
    });
}

module.exports.saveFcmToken = function (user_id, type, token_id, device_token, cb) {
    // insert new token with token_id, if exist change token_id & user_id
    new Models.FirebaseToken({
        user_id: user_id,
        token_id: token_id,
        type: type,
        token: device_token
    }).save()
        .then(function (tokenInsert) {
            return cb(false, tokenInsert.toJSON());
        })
        .catch(function () {
            // update
            knex('firebase_tokens')
                .where('token', '=', device_token)
                .update({
                    user_id: user_id,
                    token_id: token_id
                })
                .then(function (result) {
                    return cb(false, result)
                })
                .catch(function () {
                    return cb(true);
                });
        });
};

function deleteAllUserToken(user_id, cb) {
    knex('tokens').where('user_id', user_id).del()
        .then(function () {
            knex('firebase_tokens').where('user_id', user_id).del()
                .then(function () {
                    cb(false);
                });
        })
        .catch(function () {
            cb(true);
        });
}

module.exports.changePassword = function (user_id, old_password, new_password, cb) {
    new Models.User({
        id: user_id
    }).fetch().then(function (userSql) {
        userSql = userSql.toJSON();

        // check old password
        bcrypt.compare(old_password, userSql.password, function (err, res) {
            if (!res) {//Password invalid
                return cb(true, 'Invalid password!');
            }

            resetNewPass(user_id, new_password, cb);
        });
    });
};

module.exports.resetNewPass = resetNewPass;

function resetNewPass(user_id, new_password, cb) {
    // hash password
    bcrypt.hash(new_password, 10, function (err, hashPassword) {
        if (!err) {
            // change password to db
            new Models.User({
                id: user_id
            }).save(
                {password: hashPassword},
                {method: 'update', patch: true})
                .then(function () {

                    new Models.User({
                        id: user_id
                    }).fetch().then(function (userSql) {
                        userSql = userSql.toJSON();
                        // delete all user token & firebase token
                        deleteAllUserToken(user_id, function (err) {
                            if (!err) {
                                // save token
                                saveNewToken(userSql, function (err, responseData) {
                                    if (!err) {
                                        return cb(false, responseData);
                                    } else {
                                        return cb(true, 'Something went wrong!');
                                    }
                                });
                            } else {
                                return cb(true, 'Something went wrong!');
                            }
                        });
                    })
                })
                .catch(function () {
                    return cb(true, 'Something went wrong!');
                });
        } else {
            return cb(true, 'Something went wrong!');
        }
    });
}

module.exports.sendResetPass = function (email_user, code_user, cb) {
    new Models.User({
        email: email_user,
        code: code_user
    }).fetch()
        .then(function (userSql) {

            if (!_.isEmpty(userSql)) {
                userSql = userSql.toJSON();
                userSql.is_token_refresh_pass = true;
                saveNewToken(userSql, function (err, userRes) {
                    if (!err) {
                        emailService.sendRefreshPass(userRes.user, userRes.token, function (err) {
                            if (!err) {
                                delete userRes.user.is_token_refresh_pass;

                                return cb(false, userRes.user);
                            } else {
                                return cb(true, 'Something went wrong!');
                            }
                        });

                    } else {
                        return cb(true, 'Something went wrong!');
                    }
                });
            } else {
                return cb(true, 'User is not exist');
            }
        })
        .catch(function (err) {
            return cb(true, 'Something went wrong');
        });
};

function insertNewStudentToDatabase(email, code, name, username, password, capability, birthday, regularClass, cb) {
// kiem tra capability
    if (capability === 'student' || capability === 'teacher') {
        // Tìm xem có thằng nào đăng ký email này chưa?
        new Models.User({
            email: email
        }).fetch().then(function (users) {
            if (!_.isEmpty(users)) {// Email này có rồi!
                return cb(true, 'Email already exists!');
            }

            new Models.User({
                code: code
            }).fetch().then(function (users) {
                if (!_.isEmpty(users)) {// code này có rồi!
                    return cb(true, 'Code already exists!');
                }
            }).catch(function () {
                return cb(true, 'UserService, Something went wrong');
            });

            //Đăng ký thôi
            if (_.isEmpty(password)) {
                password = code;
            }

            if (_.isEmpty(username)) {
                let tempSplit = _.split(email, '@');
                username = tempSplit[0];
            }

            bcrypt.hash(password, 10, function (err, hash) {
                new Models.User({
                    email: email,
                    username: username,
                    code: code,
                    name: name,
                    birthday: birthday,
                    password: hash,
                    capability: capability,
                    regular_class: regularClass
                }).save(null, {method: 'insert'}).then(function (user) {
                    if (_.isEmpty(user)) {
                        return cb(true, 'Service Unavailable');
                    }

                    // console.log('insert ok');
                    return cb(false, user.toJSON());
                }).catch(function () {
                    return cb(true, 'UserService, Something went wrong');
                });
            });
        })
            .catch(function () {
                return cb(true, 'UserService, Something went wrong');
            });
    } else {
        return cb(true, 'capability is not valid!');
    }
}

function insertNewStudentToDatabase2(email, code, name, username, password, capability, birthday, regularClass, cb) {
// kiem tra capability
    if (capability === 'student' || capability === 'teacher') {
        // Tìm xem có thằng nào đăng ký email này chưa?
        new Models.User({
            email: email
        }).fetch().then(function (users) {
            // if (!_.isEmpty(users)) {// Email này có rồi!
            //     return cb(true, 'Email already exists!');
            // }

            new Models.User({
                code: code
            }).fetch().then(function (users) {
                if (!_.isEmpty(users)) {// code này có rồi!
                    return cb(true, 'Code already exists!');
                }
            }).catch(function (err) {
                return cb(true, err);
            });

            //Đăng ký thôi
            if (_.isEmpty(password)) {
                password = code;
            }

            if (_.isEmpty(username)) {
                let tempSplit = _.split(email, '@');
                username = tempSplit[0];
            }

            bcrypt.hash(password, 10, function (err, hash) {
                new Models.User({
                    code: code,
                    name: name,
                    birthday: birthday,
                    password: hash,
                    capability: capability,
                    regular_class: regularClass
                }).save(null, {method: 'insert'}).then(function (user) {
                    if (_.isEmpty(user)) {
                        return cb(true, 'Service Unavailable');
                    }

                    // console.log('insert ok');
                    return cb(false, user.toJSON());
                }).catch(function (err) {
                    return cb(true, err);
                });
            });
        })
            .catch(function () {
                return cb(true, 'UserService, Something went wrong');
            });
    } else {
        return cb(true, 'capability is not valid!');
    }
}

module.exports.insertNewStudentToDatabase = insertNewStudentToDatabase;
module.exports.insertNewStudentToDatabase2 = insertNewStudentToDatabase2;

module.exports.addUserFromFileExel = function (file, user_id, user_code, cb) {
    fileService.saveFileAndGetStaticURL(file, user_code, function (err, res, savePath) {
        if (!err) {
            // save to db
            new Models.AttackFile({
                user_id: user_id,
                type: 'file/xlsx',
                url: res.url
            }).save();

            studentInfoService.pareAndInsertStudentToDatabase(savePath, cb);
        } else {
            return cb(true, 'UserService, Something went wrong!');
        }
    })
};

module.exports.userJoinClass = function (userCode, classId, cb) {
    new Models.User({
        code: userCode
    }).fetch().then(function (user) {
        if (_.isEmpty(user)) {
            return cb(true, 'Student code is invalid!');
        }
        let userId = _.get(user, 'id', '');
        new Models.User_Class({
            user_id: userId,
            class_id: classId
        }).fetch().then(function (uc) {
            if (_.isEmpty(uc)) {
                new Models.User_Class({
                    user_id: userId,
                    class_id: classId
                }).save(null, {method: 'insert'}).then(function (uc) {
                    if (!_.isEmpty(uc)) {
                        return cb(false, 'User join success!');
                    } else {
                        return cb(true, 'Something went wrong');
                    }
                }).catch(function () {
                    return cb(true, 'Something went wrong');
                });
            } else {
                return cb(true, 'User has already joined!');
            }
        });
    }).catch(function () {
        return cb(true, 'Something went wrong');
    });
};

function getClassRank(class_id, cb) {
    new Models.Class({
        id: class_id
    }).fetch({withRelated: 'users'})
        .then(function (classInfo) {
            classInfo = classInfo.toJSON();
            // console.log(classInfo);

            async.each(classInfo.users,
                function (user, next) {
                    delete user.password;
                    // get user infor rank here
                    getUserInfoRank(class_id, user.id, function (err, res) {
                        if (!err) {
                            // console.log(res);
                            user.post_count = res.post_count;
                            user.vote_count = res.vote_count;
                            user.solve_count = res.solve_count;
                            user.point_count = res.point_count;
                        }

                        next();
                    });
                },
                function (err) {
                    if (!err) {
                        // sort and filter student
                        let users = classInfo.users;
                        users.sort(function (user1, user2) {
                            return user2.point_count - user1.point_count;
                        });
                        classInfo.users = users.filter((user) => user.capability === 'student');

                        cb(false, classInfo);
                    } else {
                        cb(true, 'Something went wrong');
                    }
                }
            )
        })
        .catch(function (err) {
            // console.log(err);
            cb(true, 'Something went wrong');
        });
}

function getUserInfoRank(class_id, user_id, cb) {
    let post_count = 0;
    let vote_count = 0;
    let solve_count = 0;
    let point_count = 0;
    // get post_count, vote_count, solve_count, point_count
    new Models.Post()
        .query(function (qb) {
            qb.where('class_id', '=', class_id)
                .andWhere('user_id', '=', user_id)

        })
        .fetchAll()
        .then(function (posts) {
            posts = posts.toJSON();
            post_count = posts.length;
            // console.log('post_count: ' + post_count);

            // get vote_count
            new Models.Vote()
                .query(function (qb) {
                    let subPostUserQuery = knex('posts')
                        .where('class_id', '=', class_id)
                        .andWhere('user_id', '=', user_id)
                        .select('id');

                    let subPostQuery = knex('posts')
                        .where('class_id', '=', class_id)
                        .select('id');

                    let subCmtQuery = knex('comments')
                        .where('post_id', 'in', subPostQuery)
                        .andWhere('user_id', '=', user_id)
                        .select('id');

                    qb.where(function () {
                        this.where('votes.comment_id', 'in', subCmtQuery)
                            .orWhere('votes.post_id', 'in', subPostUserQuery)
                    });
                    // .andWhere('votes.up', '=', '1');
                })
                .fetchAll()
                .then(function (votes) {
                    votes = votes.toJSON();
                    // vote_count = votes.length;
                    for (let vote of votes) {
                        if (vote.up == true) {
                            vote_count++;
                        } else {
                            vote_count--;
                        }
                    }

                    // console.log('vote_count: ' + vote_count);

                    // get solve_count
                    new Models.Comment()
                        .query(function (qb) {
                            let subPostQuery = knex('posts')
                                .where('class_id', '=', class_id)
                                .select('id');

                            qb.where('user_id', '=', user_id)
                                .andWhere('is_solve', '=', '1')
                                .andWhere('post_id', 'in', subPostQuery);
                        })
                        .fetchAll()
                        .then(function (cmts) {
                            cmts = cmts.toJSON();
                            solve_count = cmts.length;

                            // console.log('solve_count: ' + solve_count);

                            point_count = (solve_count * POINT_SOLVE_PER_COMMENT) + (vote_count * POINT_VOTE_PER_POST);

                            let res = {
                                post_count: post_count,
                                vote_count: vote_count,
                                solve_count: solve_count,
                                point_count: point_count
                            };
                            cb(false, res);
                        })
                        .catch(function (err) {
                            // console.log(err);
                            cb(true, 'Something went wrong');
                        })
                })
                .catch(function (err) {
                    // console.log(err);
                    cb(true, 'Something went wrong');
                })
        })
        .catch(function (err) {
            // console.log(err);
            cb(true, 'Something went wrong');
        })
}

module.exports.getClassRank = getClassRank;