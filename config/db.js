var knex = require('knex')({
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        user: 'root',
        password: '',
        database: 'edoo',
        charset: 'utf8'
    }
});

module.exports.bookshelf = require('bookshelf')(knex);