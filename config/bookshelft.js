const config = global.helpers.config;

var knex = require('knex')({
    client: 'mysql',
    connection: {
        host: config('DB_HOST', 'localhost'),
        user: config('DB_USER', 'root'),
        password: config('DB_PASSWORD', ''),
        database: config('DB_NAME', 'edoo'),
        charset: config('DB_CHARSET', 'utf8')
    }
});

const bookshelf = require('bookshelf')(knex);
bookshelf.plugin('pagination');

module.exports.bookshelf = bookshelf;
module.exports.knex = knex;