module.exports = {

    development: {
        client: 'mysql',
        connection: {
            host: '127.0.0.1',
            user: 'root',
            password: '1234',
            database: 'edoo_1',
            charset: 'utf8'
        },
        seeds: {
            directory: './seed/dev'
        }
    }
};