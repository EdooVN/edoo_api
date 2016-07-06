var Hapi = require('hapi');

var people = { // our "users database"
    id: 1,
    name: 'Jen Tú',
    token: 'xyz',
    sdjflksf: {
        sdfksdf: 'sdfsdfsdf',
        asdjfl: {
            djflksjfsd: 'asdfsdfsdf'
        }
    }
};

var config = require('./config/server');
var key = config.key;

// bring your own validation function
var validate = function (decoded, request, callback) {
    console.log(decoded);

    request.credentials = people;

    return callback(null, true);

    // do your checks to see if the person is valid
    if (!people[decoded.id]) {
        return callback(null, false);
    }
    else {
        return callback(null, true);
    }
};

var server = new Hapi.Server();
server.connection({port: 8000});

server.register(require('hapi-auth-jwt2'), function (err) {
    if (err) {
        console.log(err);
        return;
    }

    server.auth.strategy('jwt', 'jwt',
        {
            key: key,
            validateFunc: validate,
            verifyOptions: {algorithms: ['HS256']}
        });

    server.auth.default('jwt');

    server.route([
        {
            method: 'GET', path: '/', config: {auth: false},
            handler: function (request, reply) {
                reply({text: 'Token not required'});
            }
        },
        {
            method: 'GET', path: '/getToken', config: {auth: false},
            handler: function (request, reply) {
                var jwt = require('jsonwebtoken');
                var token = jwt.sign(people, key);
                reply({token: token});
            }
        },
        {
            method: ['GET', 'POST'], path: '/restricted', config: {auth: {strategy: 'jwt', mode: 'optional'}},
            handler: function (request, reply) {
                reply(request.credentials);
            }
        }
    ]);
});

server.start(function () {
    console.log('Server running at:', server.info.uri);
});