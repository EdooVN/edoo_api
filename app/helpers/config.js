'use strict';

const _ = require('lodash');
let env = process.env;

module.exports = function getEnv(key, defaultValue) {
    return _.get(env, key, defaultValue);
};