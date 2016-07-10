
exports.up = function(knex, Promise) {
  return Promise.all([
      knex.schema.createTable('users', function (table) {
          table.increments('id').unsigned();
          table.varchar('name', 100);
          table.varchar('code', 15);
          table.date('birth');
          table.varchar('username', 100);
          table.varchar('password', 100);
          table.varchar('email', 100).unique();
          table.varchar('capability', 30);
          table.index('code');
          table.index('username');
          table.index('email');
      }),
      knex.schema.createTable('regular_classes', function (table) {
          table.increments('id').unsigned();
          table.varchar('code', 100);
          table.varchar('name', 100);
          table.integer('number_of_student', 100).unsigned();
          table.index('code');
      }),
      knex.schema.createTable('subject_classes', function (table) {
          table.increments('id').unsigned();
          table.varchar('code', 100);
          table.varchar('name', 100);
          table.integer('number_of_student', 100).unsigned();
          table.index('code');
      }),

      // Table: relationship
      knex.schema.createTable('users_regular_classes', function (table) {
          table.integer('user_id').unsigned();
          table.integer('regular_class_id').unsigned();
          table.index('user_id');
          table.index('regular_class_id');
      }),

      knex.schema.createTable('users_subject_classes', function (table) {
          table.integer('user_id').unsigned();
          table.integer('subject_class_id').unsigned();
          table.index('user_id');
          table.index('subject_class_id');
      })
  ])
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.dropTable('users'),
        knex.schema.dropTable('regular_classes'),
        knex.schema.dropTable('subject_classes'),
        knex.schema.dropTable('users_regular_classes'),
        knex.schema.dropTable('users_subject_classes')
    ])
};
