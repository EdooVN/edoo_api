'use strict';

const mkdirp = require('mkdirp');
const fs = require('fs');
const helpers = global.helpers;
const config = helpers.config;

module.exports.saveFileAndGetStaticURL = function (file, user_code, cb) {
    let name = file.hapi.filename;
    var savePath = config('PATH_FILE_UPLOAD', '/');
    let serverName = config('SERVER_STATIC_FILES', 'http://media.uetf.me');
    let timeNow = new Date(Date.now());
    let zenPath = user_code + '/' + timeNow.getTime();
    savePath = savePath + '/' + zenPath;
    var path = savePath + '/' + name;

    mkdirp(savePath, function (err) {
        if (err) {
            // console.error(err);
            // rep(Boom.badData('Something went wrong!'));
            cb(true);
        } else {
            var newFile = fs.createWriteStream(path);

            newFile.on('error', function (err) {
                // console.error(err);
                // rep(Boom.badData('Something went wrong!'));
                cb(true);
            });

            file.pipe(newFile);

            file.on('end', function (err) {
                var res = {
                    filename: file.hapi.filename,
                    headers: file.hapi.headers,
                    path: path,
                    url: (serverName + zenPath + '/' + encodeURI(name))
                };
                // rep(ResponseJSON('Upload success!', res));
                cb(false, res, path);
            })
        }
    });
};