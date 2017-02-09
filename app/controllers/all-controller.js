'use strict';

module.exports = {
    user: require('./user-controller'),
    class: require('./class-controller'),
    manager: require('./manager-controller'),
    post: require('./post-controller'),
    authGoogle: require('./oauth-google')
};