exports.up = function (knex, Promise) {
    return Promise.all([
        knex.schema.createTable('users', function (table) {
            table.increments('id').unsigned();
            table.varchar('name', 200);
            table.varchar('email', 200).unique();
            table.varchar('code', 100).notNullable().unique();
            table.varchar('username', 200);
            table.varchar('password', 200).notNullable();
            table.date('birthday');
            table.varchar('capability', 10);
            table.varchar('avatar', 200);
            table.varchar('regular_class', 200);

            table.index('code');
            table.index('username');
            table.index('email');
        }),

        knex.schema.createTable('user_detail', function (table) {
            table.increments('id').unsigned();
            table.integer('user_id').unsigned();
            table.text('favorite');
            table.text('description');
        }),

        knex.schema.createTable('tokens', function (table) {
            table.increments('id').unsigned();
            table.integer('user_id').unsigned();
            table.bigInteger('time_expire').unsigned().notNullable();
        }),

        knex.schema.createTable('firebase_tokens', function (table) {
            table.increments('id').unsigned();
            table.integer('user_id').unsigned();
            table.integer('token_id').unsigned();
            table.varchar('type', 200).notNullable();
            table.varchar('token', 200).notNullable().unique();

            table.index('user_id');
            table.index('token_id');
        }),

        knex.schema.createTable('attack_files', function (table) {
            table.increments('id').unsigned();
            table.integer('post_id').unsigned();
            table.integer('user_id').unsigned();
            table.varchar('type', 200).notNullable();
            table.varchar('url', 256).notNullable();
            table.timestamp('created_at').defaultTo(knex.fn.now());

            table.index('post_id');
            table.index('user_id');
        }),

        knex.schema.createTable('classes', function (table) {
            table.varchar('id', 200).primary();
            table.varchar('code', 200).notNullable();
            table.varchar('name', 200);
            table.varchar('type', 200);
            table.varchar('semester', 200).notNullable();
            table.integer('credit_count');
            table.integer('student_count');
            table.varchar('teacher_name', 200);

            table.index('code');
        }),

        knex.schema.createTable('lessions', function (table) {
            table.increments('id').unsigned();
            table.varchar('class_id', 200).notNullable();
            table.varchar('code', 200).notNullable();
            table.varchar('name', 200);
            table.varchar('type', 200);
            table.varchar('semester', 200).notNullable();
            table.integer('credit_count');
            table.varchar('address', 200);
            table.integer('day_of_week');
            table.varchar('period', 200);
            table.integer('student_count');
            table.varchar('teacher_name', 200);

            table.index('class_id');
        }),

        knex.schema.createTable('posts', function (table) {
            table.increments('id').unsigned();
            table.integer('user_id').unsigned();
            table.varchar('class_id', 200);
            table.varchar('title', 500);
            table.text('content');
            table.text('description');
            table.varchar('type', 200);
            table.varchar('tag', 200);
            table.boolean('is_incognito');
            table.boolean('is_post_teacher');
            table.boolean('is_solve');
            table.timestamps();

            table.index('user_id');
            table.index('class_id');
        }),

        knex.schema.createTable('seens', function (table) {
            table.increments('id').unsigned();
            table.integer('post_id').unsigned();
            table.integer('user_id').unsigned();
        }),

        knex.schema.createTable('comments', function (table) {
            table.increments('id').unsigned();
            table.integer('post_id').unsigned();
            table.integer('user_id').unsigned();
            table.text('content').notNullable();
            table.boolean('is_solve');
            table.boolean('is_incognito');
            table.timestamps();
        }),

        knex.schema.createTable('rep_comments', function (table) {
            table.increments('id').unsigned();
            table.integer('comment_id').unsigned();
            table.integer('user_id').unsigned();
            table.text('content').notNullable();
            table.boolean('is_incognito');
            table.timestamps();
        }),

        knex.schema.createTable('votes', function (table) {
            table.increments('id').unsigned();
            table.integer('user_id').unsigned();
            table.integer('post_id').unsigned();
            table.integer('comment_id').unsigned();
            table.varchar('type', 100);
            table.boolean('up');
        }),

        knex.schema.createTable('supports', function (table) {
            table.increments('id').unsigned();
            table.varchar('email', 200);
            table.text('type').notNullable();
            table.text('content').notNullable();
            table.timestamps();
        }),

        // Table extend infomation

        // Ver1: nop bai tap
        knex.schema.createTable('event_extend', function (table) {
            table.integer('post_id').unsigned();

            table.varchar('time_end', 200);
            table.timestamp('created_at').defaultTo(knex.fn.now());

            table.index('post_id');
        }),

        // Table: relationship

        knex.schema.createTable('users_classes', function (table) {
            table.integer('user_id').unsigned();
            table.varchar('class_id', 200);

            table.index('user_id');
            table.index('class_id');
        })

        // knex.schema.createTable('event_file', function (table) {
        //     table.integer('post_id').unsigned();
        //     table.integer('user_id').unsigned();
        //     table.text('url').notNullable();
        //
        //     table.index('post_id');
        //     table.index('user_id');
        // })
    ])
};

exports.down = function (knex, Promise) {
    return Promise.all([
        knex.schema.dropTable('users'),
        knex.schema.dropTable('tokens'),
        knex.schema.dropTable('firebase_tokens'),
        knex.schema.dropTable('classes'),
        knex.schema.dropTable('lessions'),
        knex.schema.dropTable('users_classes'),
        knex.schema.dropTable('posts'),
        knex.schema.dropTable('comments'),
        knex.schema.dropTable('votes')
    ])
};
