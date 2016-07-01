'use strict';

const myPlugin = {
    register: function (server, options, next) {
        next();
    }
};

myPlugin.register.attributes = {
    name: 'myPlugin',
    version: '1.0.0'
};