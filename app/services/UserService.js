'use strict';

const Models = global.Models;
const commons = global.helpers.commons;
const jwt = require('jsonwebtoken');

let config = global.helpers.config;
const SERVER_KEY = config('SERVER_KEY', '');

module.exports.updateToken = function (tokenId) {
    // console.log(tokenId);
    new Models.Token({
        id: tokenId
    }).save(
        {time_expire: (Date.now() + commons.timeExtension)},
        {method: 'update', patch: true})
};

module.exports.getTokenUser = function (user, callback) {
    let tokenUser = jwt.sign(user, SERVER_KEY);
    callback(tokenUser);
};