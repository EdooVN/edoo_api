'use strict';

const utils = require('./utils');

// validate time from input to system format
function validateTime(inputTime) {
    // systemp format is yyyy-MM-dd
    // input format is dd-MM-yyyy
    let splitTimeString = utils.replaceAll(inputTime, '-', '/').split('/');
    let d = splitTimeString[0];
    let m = splitTimeString[1];
    let y = splitTimeString[2];

    return y + '-' + m + '-' + d;
}

// console.log(validateTime('18-10-1995'));

module.exports.validateTime = validateTime;