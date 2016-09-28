'use strict';

const mkdirp = require('mkdirp');
const fs = require('fs');
const archiver = require('archiver');
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

    let zenPath = '/' + post_id + '/' + user_code + '/' + timeNow.getTime();
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

function createZipFileAndGetStaticURL(fileName, filePath, cb) {
    let timeNow = new Date(Date.now());
    let PATH_ZIP_TEMP = config('PATH_ZIP_TEMP');
    let PATH_STATIC_FILE = config('PATH_STATIC_FILE');
    let SERVER_STATIC_FILES = config('SERVER_STATIC_FILES');
    let saveZipFile = PATH_STATIC_FILE + PATH_ZIP_TEMP + '/' + timeNow.getTime() + '/' + fileName;

    mkdirp(PATH_STATIC_FILE + PATH_ZIP_TEMP + '/' + timeNow.getTime(), function (err) {
        if (!err){
            var output = fs.createWriteStream(saveZipFile);
            let archive = archiver.create('zip', {});

            output.on('close', function () {
                console.log(archive.pointer() + ' total bytes');
                console.log('archiver has been finalized and the output file descriptor has closed.');

                let staticURL = SERVER_STATIC_FILES + encodeURI(PATH_ZIP_TEMP + '/' + timeNow.getTime() + '/' + fileName);

                cb(false, staticURL);
            });

            archive.on('error', function (err) {
                return cb(true, 'Can create file');
            });

            archive.pipe(output);
            archive.bulk([
                {expand: true, cwd: filePath, src: ['**/*']}
            ]);
            archive.finalize();
        } else {
            return cb(true, 'Can create file');
        }
    });
}

module.exports.zipFileEvent = function (post_id, cb) {
    let PATH_EVENT_UPLOAD = config('PATH_EVENT_UPLOAD');
    let PATH_STATIC_FILE = config('PATH_STATIC_FILE');
    let saveDirEvent = PATH_STATIC_FILE + PATH_EVENT_UPLOAD + '/' + post_id + '/';
    //test
    createZipFileAndGetStaticURL('nop_btvn.zip', saveDirEvent, cb);
};
