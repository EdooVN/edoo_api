var knex = require('knex')({
    client: 'mysql',
    connection: {
        host: 'localhost',
        user: 'api_uetf_me',
        password: 'e71V9IPwhLzK2ou',
        database: 'api_uetf_me',
        charset: 'utf8'
    }
});

module.exports.bookshelf = require('bookshelf')(knex);