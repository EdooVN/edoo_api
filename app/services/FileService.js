'use strict';

const mkdirp = require('mkdirp');
const fs = require('fs');
const helpers = global.helpers;
const config = helpers.config;

module.exports.saveFileAndGetStaticURL = function (file, user_code, cb) {
    let timeNow = new Date(Date.now());
    let name = file.hapi.filename;

    var PATH_STATIC_FILE = config('PATH_STATIC_FILE');
    let PATH_FILE_UPLOAD = config('PATH_FILE_UPLOAD');
    let SERVER_STATIC_FILES = config('SERVER_STATIC_FILES', 'http://media.uetf.me');

    let zenPath = '/' + user_code + '/' + timeNow.getTime();
    var saveFilePathServer = PATH_STATIC_FILE + PATH_FILE_UPLOAD + zenPath + '/' + name;

    mkdirp(PATH_STATIC_FILE + PATH_FILE_UPLOAD + zenPath, function (err) {
        if (err) {
            cb(true);
        } else {
            var newFile = fs.createWriteStream(saveFilePathServer);

            newFile.on('error', function (err) {
                cb(true);
            });

            file.pipe(newFile);

            file.on('end', function (err) {
                var res = {
                    filename: file.hapi.filename,
                    headers: file.hapi.headers,
                    path: saveFilePathServer,
                    url: (SERVER_STATIC_FILES + encodeURI(PATH_FILE_UPLOAD + zenPath + '/' + name))
                };
                cb(false, res, saveFilePathServer);
            })
        }
    });
};

module.exports.saveFileEventAndGetStaticURL = function (file, post_id, user_code, cb) {
    let timeNow = new Date(Date.now());
    let name = file.hapi.filename;

    var PATH_STATIC_FILE = config('PATH_STATIC_FILE');
    let PATH_FILE_UPLOAD = config('PATH_EVENT_UPLOAD');
    let SERVER_STATIC_FILES = config('SERVER_STATIC_FILES', 'http://media.uetf.me');

    let zenPath = '/' + user_code + '/' + timeNow.getTime();
    var saveFilePathServer = PATH_STATIC_FILE + PATH_FILE_UPLOAD + zenPath + '/' + name;

    mkdirp(PATH_STATIC_FILE + PATH_FILE_UPLOAD + zenPath, function (err) {
        if (err) {
            cb(true);
        } else {
            var newFile = fs.createWriteStream(saveFilePathServer);

            newFile.on('error', function (err) {
                cb(true);
            });

            file.pipe(newFile);

            file.on('end', function (err) {
                var res = {
                    filename: file.hapi.filename,
                    headers: file.hapi.headers,
                    path: saveFilePathServer,
                    url: (SERVER_STATIC_FILES + encodeURI(PATH_FILE_UPLOAD + zenPath + '/' + name))
                };
                cb(false, res, saveFilePathServer);
            })
        }
    });
};