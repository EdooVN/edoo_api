
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return Promise.all([
      knex('users').del()
          .then(function () {
              return Promise.all([
                  knex('users').insert({
                      id: 1,
                      name: 'Trần Minh Quý',
                      code: '13020355',
                      birth: '1995-11-07',
                      username: 'quytm_58',
                      password: '123456',
                      email: 'quytm_58@vnu.edu.vn',
                      capability: 'student'
                  }),
                  knex('users').insert({
                      id: 2,
                      name: 'Trần Văn Tú',
                      code: '13020499',
                      birth: '1995-11-07',
                      username: 'quytm_58',
                      password: '123456',
                      email: 'tutv_58@vnu.edu.vn',
                      capability: 'student'
                  }),
                  knex('users').insert({
                      id: 3,
                      name: 'Nguyễn Tiến Minh',
                      code: '13020285',
                      birth: '1995-11-07',
                      username: 'quytm_58',
                      password: '123456',
                      email: 'minhnt_58@vnu.edu.vn',
                      capability: 'student'
                  })
              ]);
          }),
      knex('regular_classes').del()
          .then(function () {
              return Promise.all([
                  knex('regular_classes').insert({
                      id: 1,
                      code: 'QH K58CLC',
                      name: 'K58CLC',
                      number_of_student: 69
                  }),
                  knex('regular_classes').insert({
                      id: 2,
                      code: 'QH K58CC',
                      name: 'K58CC',
                      number_of_student: 70
                  })
              ])
          }),
      knex('users_regular_classes').del()
          .then(function () {
              return Promise.all([
                  knex('users_regular_classes').insert({
                      user_id: 1,
                      regular_class_id: 1
                  }),
                  knex('users_regular_classes').insert({
                      user_id: 2,
                      regular_class_id: 1
                  })
              ])
          })
  ])
};
