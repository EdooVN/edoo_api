module.exports = {

    development: {
        client: 'mysql',
        connection: {
            host: 'localhost',
            user: 'api_uetf_me',
            password: 'e71V9IPwhLzK2ou',
            database: 'api_uetf_me',
            charset: 'utf8'
        },
        seeds: {
            directory: './seed/dev'
        }
    }
};