'use strict';

exports.seed = function (knex, Promise) {
    let now = new Date(Date.now());
    // Deletes ALL existing entries
    return Promise.all([
        knex('users').del()
            .then(function () {
                return Promise.all([
                    knex('users').insert({
                        id: 1,
                        name: 'Trần Minh Quý',
                        code: '13020355',
                        birthday: '1995-11-07',
                        username: 'quytm_58',
                        password: '$2a$10$dtaAZp55vPJgE4C759fkFOd.ISEcU2AvdL49yXGgBWSmiEuWfHfQi',
                        email: 'quytm_58@vnu.edu.vn',
                        capability: 'student',
                        avatar : 'https://lh4.googleusercontent.com/t84SFLH5SxzWhNSJrBFXfwHs12mPUl0hxpQdDCMHKNZDo70l46V_qcxUaGpfl_ubJJbBwSxvY1X-rzY=w2478-h1406'
                    }),
                    knex('users').insert({
                        id: 2,
                        name: 'Trần Văn Tú',
                        code: '13020499',
                        birthday: '1995-11-07',
                        username: 'tutv95',
                        password: '$2a$10$dtaAZp55vPJgE4C759fkFOd.ISEcU2AvdL49yXGgBWSmiEuWfHfQi',
                        email: 'tutv_58@vnu.edu.vn',
                        capability: 'student',
                        avatar : 'https://lh4.googleusercontent.com/t84SFLH5SxzWhNSJrBFXfwHs12mPUl0hxpQdDCMHKNZDo70l46V_qcxUaGpfl_ubJJbBwSxvY1X-rzY=w2478-h1406'
                    }),
                    knex('users').insert({
                        id: 3,
                        name: 'Nguyễn Tiến Minh',
                        code: '13020285',
                        birthday: '1995-11-07',
                        username: 'minhnt',
                        password: '$2a$10$dtaAZp55vPJgE4C759fkFOd.ISEcU2AvdL49yXGgBWSmiEuWfHfQi',
                        email: 'minhnt_58@vnu.edu.vn',
                        capability: 'student',
                        avatar : 'https://scontent-hkg3-1.xx.fbcdn.net/v/t1.0-9/12096202_898864656850723_4092586705994255622_n.jpg?oh=aae1d9601bedcadad09c217b38225fce&oe=5852665B'
                    }),
                    knex('users').insert({
                        id : 4,
                        name: 'Tô Văn Khánh',
                        code: '1234',
                        birthday: '1995-11-07',
                        username: 'khanhtv',
                        password: '$2a$10$dtaAZp55vPJgE4C759fkFOd.ISEcU2AvdL49yXGgBWSmiEuWfHfQi',
                        email: 'khanhtv@vnu.edu.vn',
                        capability: 'teacher',
                        avatar : 'https://lh4.googleusercontent.com/t84SFLH5SxzWhNSJrBFXfwHs12mPUl0hxpQdDCMHKNZDo70l46V_qcxUaGpfl_ubJJbBwSxvY1X-rzY=w2478-h1406'
                    })
                ]);
            }),
        knex('classes').del()
            .then(function () {
                return Promise.all([
                    knex('classes').insert({
                        id: 'INT20041-2016-2017',
                        code: 'INT2004',
                        name: 'Lập trình hướng đối tượng',
                        type: 'subject',
                        semester: '1-2016-2017',
                        credit_count: 4,
                        student_count: 90,
                        teacher_name: "Tran Thi Minh Chau"
                    }),
                    knex('classes').insert({
                        id: 'INT20031-2016-2017',
                        code: 'INT2003',
                        name: 'Lập trình nâng cao',
                        type: 'subject',
                        semester: '1-2016-2017',
                        credit_count: 4,
                        student_count: 90,
                        teacher_name: "Tran Thi Minh Chau"
                    })
                ])
            }),

        knex('users_classes').del()
            .then(function () {
                return Promise.all([
                    knex('users_classes').insert({
                        user_id: 1,
                        class_id: 'INT20041-2016-2017'
                    }),
                    knex('users_classes').insert({
                        user_id: 1,
                        class_id: 'INT20031-2016-2017'
                    }),
                    knex('users_classes').insert({
                        user_id: 3,
                        class_id: 'POL100141-2016-2017'
                    }),
                    knex('users_classes').insert({
                        user_id: 3,
                        class_id: 'INT340621-2016-2017'
                    }),
                    knex('users_classes').insert({
                        user_id: 3,
                        class_id: 'MAT109311-2016-2017'
                    })
                ])
            }),


        knex('posts').del()
            .then(function () {
                return Promise.all([
                    knex('posts').insert({
                        id : 1,
                        user_id : 1,
                        class_id : 'INT20031-2016-2017',
                        title: 'Hoi ve Java',
                        content: 'Một interface không phải là một lớp. Viết một interface giống như viết một lớp, ' +
                        'nhưng chúng có 2 định nghĩa khác nhau. ' +
                        'Một lớp mô tả các thuộc tính và hành vi của một đối tượng. ' +
                        'Một interface chứa các hành vi mà một class triển khai.',
                        type: 'question',
                        tag: 'java',
                        is_incognito : false,
                        created_at : now.toISOString()
                    }),
                    knex('posts').insert({
                        id : 2,
                        user_id : 1,
                        class_id : 'INT20031-2016-2017',
                        title: 'ok men',
                        content: 'Mặc dù vây, một interface khác với một class ở một số điểm sau đây, bao gồm:' +
                        'Bạn không thể khởi tạo một interface.' +
                        'Một interface không chứa bất cứ hàm contructor nào.' +
                        'Tất cả các phương thức của interface đều là abstract.' +
                        'Một interface không thể chứa một trường nào trừ các trường vừa static và final.' +
                        'Một interface không thể kế thừa từ lớp, nó được triển khai bởi một lớp.' +
                        'Một interface có thể kế thừa từ nhiều interface khác.',
                        type : 'note',
                        tag : 'interface',
                        is_incognito : false,
                        created_at : now.toISOString()
                    }),
                    knex('posts').insert({
                        id : 3,
                        user_id : 1,
                        class_id : 'INT20031-2016-2017',
                        title: 'ok men',
                        content: 'Mặc dù vây, một interface khác với một class ở một số điểm sau đây, bao gồm:' +
                        'Bạn không thể khởi tạo một interface.' +
                        'Một interface không chứa bất cứ hàm contructor nào.' +
                        'Tất cả các phương thức của interface đều là abstract.' +
                        'Một interface không thể chứa một trường nào trừ các trường vừa static và final.' +
                        'Một interface không thể kế thừa từ lớp, nó được triển khai bởi một lớp.' +
                        'Một interface có thể kế thừa từ nhiều interface khác.',
                        type : 'note',
                        tag : 'interface',
                        is_incognito : true,
                        created_at : now.toISOString()
                    })
                ])
            }),

        knex('comments').del()
            .then(function () {
                return Promise.all([
                    knex('comments').insert({
                        id : 1,
                        user_id: 1,
                        post_id: 3,
                        content: 'Day la 1 cai comment tu te!',
                        is_solve: 1,
                        created_at : now.toISOString()
                    }),
                    knex('comments').insert({
                        id : 2,
                        user_id: 1,
                        post_id: 1,
                        content: 'Day la 1 cai cmt tu te!',
                        is_solve: 0,
                        is_incognito : false,
                        created_at : now.toISOString()
                    }),
                    knex('comments').insert({
                        id: 3,
                        user_id: 1,
                        post_id: 3,
                        content: 'Day la 1 cai comment 2 tu te!',
                        is_solve: 0,
                        is_incognito : true,
                        created_at : now.toISOString()
                    }),
                    knex('comments').insert({
                        id : 4,
                        user_id: 1,
                        post_id: 1,
                        content: 'Day la 1 cai comment 3 tu te!',
                        is_solve: 0,
                        is_incognito : true,
                        created_at : now.toISOString()
                    })
                ])
            }),

        knex('rep_comments').del()
            .then(function () {
                return Promise.all([
                    knex('rep_comments').insert({
                        id : 1,
                        user_id: 1,
                        comment_id : 4,
                        content : 'ok men rep cmt sdflkjsdlfjsdlkfjskldfjklsdjf',
                        is_incognito: false,
                        created_at : now.toISOString()
                    }),
                    knex('rep_comments').insert({
                        id : 2,
                        user_id: 1,
                        comment_id : 4,
                        content : 'incognito ok men rep comment',
                        is_incognito: true,
                        created_at : now.toISOString()
                    })
                ])
            }),

        knex('votes').del()
            .then(function () {
                return Promise.all([
                    knex('votes').insert({
                        id : 1,
                        user_id: 1,
                        post_id: 1,
                        type : 'post',
                        up : true
                    }),
                    knex('votes').insert({
                        id : 2,
                        user_id: 1,
                        comment_id: 2,
                        type : 'comment',
                        up : true
                    }),
                    knex('votes').insert({
                        id : 3,
                        user_id: 2,
                        comment_id: 2,
                        type : 'comment',
                        up : true
                    }),
                    knex('votes').insert({
                        id : 4,
                        user_id: 3,
                        comment_id: 4,
                        type : 'comment',
                        up : true
                    }),
                    knex('votes').insert({
                        id : 5,
                        user_id: 1,
                        post_id: 3,
                        type : 'post',
                        up : false
                    })
                ])
            }),

        // end
    ])
};
