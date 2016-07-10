var knex = require('knex')({
    client: 'mysql',
    connection: {
        host: 'localhost',
        user: 'edoo_dev',
        password: 'CEx0AwHMjKWJTc2',
        database: 'edoo_dev',
        charset: 'utf8'
    }
});

module.exports.bookshelf = require('bookshelf')(knex);