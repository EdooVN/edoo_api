'use strict';

function replaceAll(string, search, replace) {
    return string.split(search).join(replace);
}

// console.log(replaceAll('uet/sdf/sdfsdf/s', '-', '/'));

module.exports.replaceAll = replaceAll;
