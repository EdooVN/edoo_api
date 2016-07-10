module.exports = {

    development: {
        client: 'mysql',
        connection: {
            host: 'localhost',
            user: 'edoo_dev',
            password: 'CEx0AwHMjKWJTc2',
            database: 'edoo_dev',
            charset: 'utf8'
        },
        seeds: {
            directory: './seed/dev'
        }
    }
};