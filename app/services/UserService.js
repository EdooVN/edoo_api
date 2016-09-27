'use strict';

const _ = require('lodash');
const bcrypt = require('bcrypt');
const knex = require('../../config/bookshelft').knex;
const Models = global.Models;
const commons = global.helpers.commons;
const jwt = require('jsonwebtoken');
const postService = require('./PostService');
const emailService = require('./EmailService');
const fileService = require('./FileService');
const studentInfoService = require('./StudentInfoService');

let config = global.helpers.config;
const SERVER_KEY = config('SERVER_KEY', '');

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

                let pointCount = (solve_count * 40) + (vote_count * 5);

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

module.exports.insertNewStudentToDatabase = insertNewStudentToDatabase;

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