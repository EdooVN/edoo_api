'use strict';

class Response {
    constructor(message, data, error, code) {
        this.message = message;
        this.error = error;
        this.statusCode = code;
        this.data = data;
    }
}

module.exports = function (message, data, error, code) {
    data = data || null;
    error = error || false;
    code = code || 200;

    return new Response(message, data, error, code);
};