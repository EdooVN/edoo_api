'use strict';
const Models = global.Models;
const commons = global.helpers.commons;

module.exports.updateToken = function (tokenId) {
    new Models.Token({
        id: tokenId
    }).save(
        {time_expire: (Date.now() + commons.timeExtension)},
        {method: 'update', patch: true})
};