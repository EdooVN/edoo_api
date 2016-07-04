module.exports.register = function register(server, options, next) {
    const scheme = function (server, options) {
        return {
            authenticate: function (request, reply) {
                console.debug(request.params);

                return reply.continue({credentials: {user: 'john'}});
            }
        };
    };

    server.auth.scheme('custom', scheme);
    server.auth.strategy('okman', 'custom');
};

module.exports.register.attributes = {
    name: 'Authentication',
    version: '1.0.0'
};