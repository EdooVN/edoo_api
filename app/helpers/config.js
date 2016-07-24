module.exports = function getEnv(key, defaultValue) {
    const _ = require('lodash');

    let env = process.env;
    return _.get(env, key, defaultValue);
};