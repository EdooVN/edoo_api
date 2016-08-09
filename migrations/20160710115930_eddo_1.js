exports.up = function (knex, Promise) {
    return Promise.all([
        knex.schema.createTable('users', function (table) {
            table.increments('id').unsigned();
            table.varchar('name', 200);
            table.varchar('email', 200).notNullable().unique();
            table.varchar('code', 100).notNullable().unique();
            table.varchar('username', 200).notNullable();
            table.varchar('password', 200).notNullable();
            table.date('birthday');
            table.varchar('capability', 10);
            table.integer('token_id').unsigned();

            table.index('code');
            table.index('username');
            table.index('email');
        }),

        knex.schema.createTable('tokens', function (table) {
            table.increments('id').unsigned();
            table.bigInteger('time_expire').unsigned().notNullable();
        }),

        knex.schema.createTable('classes', function (table) {
            table.varchar('id', 200).primary();
            table.varchar('code', 200).notNullable();
            table.varchar('name', 200);
            table.varchar('type', 200);
            table.varchar('semester', 200).notNullable();

            table.index('code');
        }),

        knex.schema.createTable('posts', function (table) {
            table.increments('id').unsigned();
            table.integer('user_id').unsigned();
            table.varchar('class_id',200);
            table.varchar('title', 500);
            table.text('content');
            table.varchar('type', 200);
            table.varchar('tag', 200);

            table.index('user_id');
            table.index('class_id');
        }),

        knex.schema.createTable('comments', function (table) {
            table.increments('id').unsigned();
            table.integer('post_id').unsigned();
            table.integer('user_id').unsigned();
            table.text('content');
            table.boolean('is_solve');
        }),

        knex.schema.createTable('votes', function (table) {
            table.increments('id').unsigned();
            table.integer('user_id').unsigned();
            table.integer('post_id').unsigned();
            table.integer('comment_id').unsigned();
            table.varchar('type', 100);
            table.boolean('up');
        }),

        // Table: relationship

        knex.schema.createTable('users_classes', function (table) {
            table.integer('user_id').unsigned();
            // table.integer('class_id').unsigned();
            table.varchar('class_id',200);

            table.index('user_id');
            table.index('class_id');
        })
    ])
};

exports.down = function (knex, Promise) {
    return Promise.all([
        knex.schema.dropTable('users'),
        knex.schema.dropTable('tokens'),
        knex.schema.dropTable('classes'),
        knex.schema.dropTable('users_classes'),
        knex.schema.dropTable('posts'),
        knex.schema.dropTable('comments'),
        knex.schema.dropTable('votes')
    ])
};
