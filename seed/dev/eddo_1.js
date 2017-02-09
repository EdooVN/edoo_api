'use strict';

// const async = require('async');

// let SEED_CLASSES = [
//     require('../seed_1.json'),
//     require('../seed_2.json')
// ];

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
                        regular_class: 'QH/ICQ-K58-CLC',
                        avatar: ''
                    }),

                    knex('users').insert({
                        id: 2,
                        name: 'Trần Văn Tú',
                        code: '13020499',
                        birthday: '1995-11-07',
                        username: 'tutv95',
                        password: '$2a$10$dtaAZp55vPJgE4C759fkFOd.ISEcU2AvdL49yXGgBWSmiEuWfHfQi',
                        email: '',
                        capability: 'student',
                        regular_class: 'QH/ICQ-K58-CLC',
                        avatar: ''
                    }),

                    knex('users').insert({
                        id: 3,
                        name: 'Nguyễn Tiến Minh',
                        code: '13020285',
                        birthday: '1995-10-10',
                        username: 'minhnt',
                        password: '$2a$10$dtaAZp55vPJgE4C759fkFOd.ISEcU2AvdL49yXGgBWSmiEuWfHfQi',
                        // email: 'minhnt_58@vnu.edu.vn',
                        capability: 'student',
                        regular_class: 'QH/ICQ-K58-CLC',
                        avatar: ''
                    }),

                    knex('users').insert({
                        id: 4,
                        name: 'Tô Văn Khánh',
                        code: '12312412',
                        birthday: '1989-11-07',
                        username: 'khanhtv',
                        password: '$2a$10$dtaAZp55vPJgE4C759fkFOd.ISEcU2AvdL49yXGgBWSmiEuWfHfQi',
                        email: 'tovankhanh@gmail.com',
                        capability: 'teacher',
                        regular_class: '',
                        avatar: ''
                    }),

                    knex('users').insert({
                        id: 5,
                        name: 'Lê Vũ Hà',
                        code: '12312234',
                        birthday: '1967-11-07',
                        username: 'halv',
                        password: '$2a$10$dtaAZp55vPJgE4C759fkFOd.ISEcU2AvdL49yXGgBWSmiEuWfHfQi',
                        email: 'halv@vnu.edu.vn',
                        capability: 'teacher',
                        regular_class: '',
                        avatar: ''
                    }),

                    knex('users').insert({
                        id: 6,
                        name: 'Nguyễn Thị Nhật Thanh',
                        code: '12312233',
                        birthday: '1967-11-07',
                        username: 'thanhntn',
                        password: '$2a$10$dtaAZp55vPJgE4C759fkFOd.ISEcU2AvdL49yXGgBWSmiEuWfHfQi',
                        email: 'thanhntn@vnu.edu.vn',
                        capability: 'teacher',
                        regular_class: '',
                        avatar: ''
                    }),

                    knex('users').insert({
                        id: 7,
                        name: 'Hoàng Xuân Huấn',
                        code: '12312231',
                        birthday: '1967-11-07',
                        username: 'huanhx',
                        password: '$2a$10$dtaAZp55vPJgE4C759fkFOd.ISEcU2AvdL49yXGgBWSmiEuWfHfQi',
                        email: 'huanhx@vnu.edu.vn',
                        capability: 'teacher',
                        regular_class: '',
                        avatar: ''
                    }),

                    knex('users').insert({
                        id: 8,
                        name: 'Dư Phương Hạnh',
                        code: '12312230',
                        birthday: '1967-11-07',
                        username: 'hanhdp',
                        password: '$2a$10$dtaAZp55vPJgE4C759fkFOd.ISEcU2AvdL49yXGgBWSmiEuWfHfQi',
                        email: 'hanhdp@vnu.edu.vn',
                        capability: 'teacher',
                        regular_class: '',
                        avatar: ''
                    }),

                    knex('users').insert({
                        id: 9,
                        name: 'Lê Phê Đô',
                        code: '12312239',
                        birthday: '1967-11-07',
                        username: 'dolp',
                        password: '$2a$10$dtaAZp55vPJgE4C759fkFOd.ISEcU2AvdL49yXGgBWSmiEuWfHfQi',
                        email: 'dolp@vnu.edu.vn',
                        capability: 'teacher',
                        regular_class: '',
                        avatar: ''
                    }),

                    knex('users').insert({
                        id: 10,
                        name: 'Lê Nguyên Khôi',
                        code: '12312238',
                        birthday: '1967-11-07',
                        username: 'khoiln',
                        password: '$2a$10$dtaAZp55vPJgE4C759fkFOd.ISEcU2AvdL49yXGgBWSmiEuWfHfQi',
                        email: 'khoiln@vnu.edu.vn',
                        capability: 'teacher',
                        regular_class: '',
                        avatar: ''
                    }),

                    knex('users').insert({
                        id: 11,
                        name: 'Hoàng Thị Thuận',
                        code: '12312237',
                        birthday: '1967-11-07',
                        username: 'thuanht',
                        password: '$2a$10$dtaAZp55vPJgE4C759fkFOd.ISEcU2AvdL49yXGgBWSmiEuWfHfQi',
                        email: 'thuanht@vnu.edu.vn',
                        capability: 'teacher',
                        regular_class: '',
                        avatar: ''
                    }),


                    knex('users').insert({
                        id: 12,
                        name: 'Nguyễn Trọng Minh Dũng',
                        code: '13020290',
                        birthday: '1995-10-10',
                        username: 'dungntm',
                        password: '$2a$10$dtaAZp55vPJgE4C759fkFOd.ISEcU2AvdL49yXGgBWSmiEuWfHfQi',
                        email: 'dungntm_58@vnu.edu.vn',
                        capability: 'student',
                        regular_class: 'QH/ICQ-K58-CLC',
                        avatar: ''
                    }),

                    knex('users').insert({
                        id: 13,
                        name: 'Vũ Minh Tấn',
                        code: '11020521',
                        birthday: '1996-10-09',
                        username: 'tuanvm',
                        password: '$2a$10$dtaAZp55vPJgE4C759fkFOd.ISEcU2AvdL49yXGgBWSmiEuWfHfQi',
                        email: '11020521@vnu.edu.vn',
                        capability: 'student',
                        regular_class: 'QH/ICQ-K59-CLC',
                        avatar: ''
                    }),

                    knex('users').insert({
                        id: 14,
                        name: 'Nguyễn Đức Chiu',
                        code: '11020522',
                        birthday: '1996-10-09',
                        username: 'khanhnd',
                        password: '$2a$10$dtaAZp55vPJgE4C759fkFOd.ISEcU2AvdL49yXGgBWSmiEuWfHfQi',
                        email: '11020522@vnu.edu.vn',
                        capability: 'student',
                        regular_class: 'QH/ICQ-K59-CLC',
                        avatar: ''
                    })
                    // , new Promise(function (resolve, reject) {
                    //     for (let subject_class of SEED_CLASSES){
                    //         console.log(subject_class);
                    //         console.log('ok men');
                    //     }
                    //     resolve();
                    // })
                ]);
            }),
        knex('classes').del()
            .then(function () {
                return Promise.all([
                    knex('classes').insert({
                        id: 'POL100111-2016-2017',
                        code: 'POL1001',
                        name: 'Tư tưởng Hồ Chí Minh',
                        type: 'subject',
                        semester: '1-2016-2017',
                        credit_count: 2,
                        student_count: 120,
                        teacher_name: "ThS.Hoàng Thị Thuận"
                    }),

                    knex('classes').insert({
                        id: 'MAT110031-2016-2017',
                        code: 'MAT1100',
                        name: 'Tối ưu hóa',
                        type: 'subject',
                        semester: '1-2016-2017',
                        credit_count: 2,
                        student_count: 90,
                        teacher_name: "PGS.TS.Hoàng Xuân Huấn"
                    }),

                    knex('classes').insert({
                        id: 'INT220731-2016-2017',
                        code: 'INT2207',
                        name: 'Cơ sở dữ liệu',
                        type: 'subject',
                        semester: '1-2016-2017',
                        credit_count: 3,
                        student_count: 30,
                        teacher_name: "ThS.Dư Phương Hạnh"
                    }),

                    knex('classes').insert({
                        id: 'ELT203541-2016-2017',
                        code: 'ELT2035',
                        name: 'Tín hiệu và hệ thống',
                        type: 'subject',
                        semester: '1-2016-2017',
                        credit_count: 3,
                        student_count: 90,
                        teacher_name: "TS.Lê Vũ Hà"
                    }),

                    knex('classes').insert({
                        id: 'MAT110141-2016-2017',
                        code: 'MAT1101',
                        name: 'Xác suất thống kê',
                        type: 'subject',
                        semester: '1-2016-2017',
                        credit_count: 3,
                        student_count: 70,
                        teacher_name: "TS.Lê Phê Đô"
                    }),

                    knex('classes').insert({
                        id: 'INT311521-2016-2017',
                        code: 'INT3115',
                        name: 'Thiết kế giao diện người dùng',
                        type: 'subject',
                        semester: '1-2016-2017',
                        credit_count: 3,
                        student_count: 90,
                        teacher_name: "TS.Nguyễn Thị Nhật Thanh"
                    }),

                    knex('classes').insert({
                        id: 'INT204421-2016-2017',
                        code: 'INT2044',
                        name: 'Lý thuyết thông tin',
                        type: 'subject',
                        semester: '1-2016-2017',
                        credit_count: 3,
                        student_count: 70,
                        teacher_name: "TS.Lê Nguyên Khôi"
                    }),

                    knex('classes').insert({
                        id: 'PES102541-2016-2017',
                        code: 'PES1025',
                        name: 'Bóng đá',
                        type: 'subject',
                        semester: '1-2016-2017',
                        credit_count: 1,
                        student_count: 45,
                        teacher_name: "TT GDTC"
                    }),

                    // lớp thầy Khánh demo kì 2

                    knex('classes').insert({
                        id : 'INT311022-2016-2017',
                        code: 'INT3110 2',
                        name: 'Phân tích và thiết kế hướng đối tượng',
                        type: 'subject',
                        semester: '2-2016-2017',
                        credit_count: 3,
                        student_count: 77,
                        teacher_name: "TS. Tô Văn Khánh"
                    }),


                    knex('classes').insert({
                        id : 'INT311032-2016-2017',
                        code: 'INT3110 3',
                        name: 'Phân tích và thiết kế hướng đối tượng',
                        type: 'subject',
                        semester: '2-2016-2017',
                        credit_count: 3,
                        student_count: 82,
                        teacher_name: "TS. Tô Văn Khánh"
                    })
                ])
            }),


        knex('lessions').del()
            .then(function () {
                return Promise.all([
                    knex('lessions').insert({
                        id : 1,
                        code : 'POL1001 1',
                        name : 'Tư tưởng Hồ Chí Minh',
                        type : 'subject',
                        semester : '1-2016-2017',
                        credit_count : 2,
                        student_count : 120,
                        teacher_name : 'ThS.Hoàng Thị Thuận',
                        class_id : 'POL100111-2016-2017',
                        address : "3-G3",
                        day_of_week : 4,
                        period : "9-10"
                    }),

                    knex('lessions').insert({
                        id : 2,
                        code: 'MAT1100 3',
                        name: 'Tối ưu hóa',
                        type: 'subject',
                        semester: '1-2016-2017',
                        credit_count: 2,
                        student_count: 90,
                        teacher_name: "PGS.TS.Hoàng Xuân Huấn",
                        class_id : 'MAT110031-2016-2017',
                        address : "303-G2",
                        day_of_week : 3,
                        period : "2-3"
                    }),

                    knex('lessions').insert({
                        id : 3,
                        code: 'INT2207 3',
                        name: 'Cơ sở dữ liệu',
                        type: 'subject',
                        semester: '1-2016-2017',
                        credit_count: 3,
                        student_count: 30,
                        teacher_name: "ThS.Dư Phương Hạnh",
                        class_id : 'INT220731-2016-2017',
                        address : "303-G2",
                        day_of_week : 3,
                        period : "2-3"
                    }),
                    knex('lessions').insert({
                        id : 900,
                        code: 'INT2207 3',
                        name: 'Cơ sở dữ liệu',
                        type: 'subject',
                        semester: '1-2016-2017',
                        credit_count: 3,
                        student_count: 30,
                        teacher_name: "ThS.Dư Phương Hạnh",
                        class_id : 'INT220731-2016-2017',
                        address : "303-G2",
                        day_of_week : 2,
                        period : "6-7"
                    }),

                    knex('lessions').insert({
                        id : 4,
                        code: 'ELT2035 3',
                        name: 'Tín hiệu và hệ thống',
                        type: 'subject',
                        semester: '1-2016-2017',
                        credit_count: 3,
                        student_count: 90,
                        teacher_name: "TS.Lê Vũ Hà",
                        class_id : 'ELT203541-2016-2017',
                        address : "207-E4",
                        day_of_week : 4,
                        period : "6-8"
                    }),

                    knex('lessions').insert({
                        id : 5,
                        code: 'MAT1101 4',
                        name: 'Xác suất thống kê',
                        type: 'subject',
                        semester: '1-2016-2017',
                        credit_count: 3,
                        student_count: 70,
                        teacher_name: "TS.Lê Phê Đô",
                        class_id : 'MAT110141-2016-2017',
                        address : "304-G2",
                        day_of_week : 6,
                        period : "6-8"
                    }),

                    knex('lessions').insert({
                        id : 6,
                        code: 'INT3115 2',
                        name: 'Thiết kế giao diện người dùng',
                        type: 'subject',
                        semester: '1-2016-2017',
                        credit_count: 3,
                        student_count: 90,
                        teacher_name: "TS.Nguyễn Thị Nhật Thanh",
                        class_id : 'INT311521-2016-2017',
                        address : "308-GĐ2",
                        day_of_week : 2,
                        period : "3-5"
                    }),

                    knex('lessions').insert({
                        id : 7,
                        code: 'INT2044 2',
                        name: 'Lý thuyết thông tin',
                        type: 'subject',
                        semester: '1-2016-2017',
                        credit_count: 3,
                        student_count: 70,
                        teacher_name: "TS.Lê Nguyên Khôi",
                        class_id : 'INT204421-2016-2017',
                        address : "304-G2",
                        day_of_week : 5,
                        period : "3-5"
                    }),

                    knex('lessions').insert({
                        id : 8,
                        code: 'PES1025 4',
                        name: 'Bóng đá',
                        type: 'subject',
                        semester: '1-2016-2017',
                        credit_count: 1,
                        student_count: 45,
                        teacher_name: "TT GDTC",
                        class_id : 'PES102541-2016-2017',
                        address : "Sân bãi",
                        day_of_week : 3,
                        period : "8-9"
                    }),

                    // lớp thầy Khánh demo kì 2

                    knex('lessions').insert({
                        id : 9,
                        code: 'INT3110 2',
                        name: 'Phân tích và thiết kế hướng đối tượng',
                        type: 'subject',
                        semester: '2-2016-2017',
                        credit_count: 3,
                        student_count: 77,
                        teacher_name: "TS. Tô Văn Khánh",
                        class_id : 'INT311022-2016-2017',
                        address : "308-G2",
                        day_of_week : 6,
                        period : "3-5"
                    }),


                    knex('lessions').insert({
                        id : 10,
                        code: 'INT3110 3',
                        name: 'Phân tích và thiết kế hướng đối tượng',
                        type: 'subject',
                        semester: '2-2016-2017',
                        credit_count: 3,
                        student_count: 82,
                        teacher_name: "TS. Tô Văn Khánh",
                        class_id : 'INT311032-2016-2017',
                        address : "309 GD2",
                        day_of_week : 3,
                        period : "6-8"
                    })
                ])
            }),

        knex('users_classes').del()
            .then(function () {
                return Promise.all([

                    // Quý
                    knex('users_classes').insert({
                        user_id: 1,
                        class_id: 'POL100111-2016-2017'
                    }),
                    knex('users_classes').insert({
                        user_id: 1,
                        class_id: 'MAT110031-2016-2017'
                    }),
                    knex('users_classes').insert({
                        user_id: 1,
                        class_id: 'INT220731-2016-2017'
                    }),
                    knex('users_classes').insert({
                        user_id: 1,
                        class_id: 'ELT203541-2016-2017'
                    }),
                    knex('users_classes').insert({
                        user_id: 1,
                        class_id: 'MAT110141-2016-2017'
                    }),
                    knex('users_classes').insert({
                        user_id: 1,
                        class_id: 'INT311521-2016-2017'
                    }),
                    knex('users_classes').insert({
                        user_id: 1,
                        class_id: 'INT204421-2016-2017'
                    }),
                    knex('users_classes').insert({
                        user_id: 1,
                        class_id: 'PES102541-2016-2017'
                    }),

                    //Tú
                    knex('users_classes').insert({
                        user_id: 2,
                        class_id: 'POL100111-2016-2017'
                    }),
                    knex('users_classes').insert({
                        user_id: 2,
                        class_id: 'MAT110031-2016-2017'
                    }),
                    knex('users_classes').insert({
                        user_id: 2,
                        class_id: 'INT220731-2016-2017'
                    }),
                    knex('users_classes').insert({
                        user_id: 2,
                        class_id: 'ELT203541-2016-2017'
                    }),
                    knex('users_classes').insert({
                        user_id: 2,
                        class_id: 'MAT110141-2016-2017'
                    }),
                    knex('users_classes').insert({
                        user_id: 2,
                        class_id: 'INT311521-2016-2017'
                    }),
                    knex('users_classes').insert({
                        user_id: 2,
                        class_id: 'INT204421-2016-2017'
                    }),
                    knex('users_classes').insert({
                        user_id: 2,
                        class_id: 'PES102541-2016-2017'
                    }),

                    // Minh
                    knex('users_classes').insert({
                        user_id: 3,
                        class_id: 'POL100111-2016-2017'
                    }),
                    knex('users_classes').insert({
                        user_id: 3,
                        class_id: 'MAT110031-2016-2017'
                    }),
                    knex('users_classes').insert({
                        user_id: 3,
                        class_id: 'INT220731-2016-2017'
                    }),
                    knex('users_classes').insert({
                        user_id: 3,
                        class_id: 'ELT203541-2016-2017'
                    }),
                    knex('users_classes').insert({
                        user_id: 3,
                        class_id: 'MAT110141-2016-2017'
                    }),
                    knex('users_classes').insert({
                        user_id: 3,
                        class_id: 'INT311521-2016-2017'
                    }),
                    knex('users_classes').insert({
                        user_id: 3,
                        class_id: 'INT204421-2016-2017'
                    }),
                    knex('users_classes').insert({
                        user_id: 3,
                        class_id: 'PES102541-2016-2017'
                    }),

                    // Dũng
                    knex('users_classes').insert({
                        user_id: 12,
                        class_id: 'POL100111-2016-2017'
                    }),
                    knex('users_classes').insert({
                        user_id: 12,
                        class_id: 'MAT110031-2016-2017'
                    }),
                    knex('users_classes').insert({
                        user_id: 12,
                        class_id: 'INT220731-2016-2017'
                    }),
                    knex('users_classes').insert({
                        user_id: 12,
                        class_id: 'ELT203541-2016-2017'
                    }),
                    knex('users_classes').insert({
                        user_id: 12,
                        class_id: 'MAT110141-2016-2017'
                    }),
                    knex('users_classes').insert({
                        user_id: 12,
                        class_id: 'INT311521-2016-2017'
                    }),
                    knex('users_classes').insert({
                        user_id: 12,
                        class_id: 'INT204421-2016-2017'
                    }),
                    knex('users_classes').insert({
                        user_id: 12,
                        class_id: 'PES102541-2016-2017'
                    }),

                    // Tuấn
                    knex('users_classes').insert({
                        user_id: 13,
                        class_id: 'POL100111-2016-2017'
                    }),
                    knex('users_classes').insert({
                        user_id: 13,
                        class_id: 'MAT110031-2016-2017'
                    }),
                    knex('users_classes').insert({
                        user_id: 13,
                        class_id: 'INT220731-2016-2017'
                    }),
                    knex('users_classes').insert({
                        user_id: 13,
                        class_id: 'ELT203541-2016-2017'
                    }),
                    knex('users_classes').insert({
                        user_id: 13,
                        class_id: 'MAT110141-2016-2017'
                    }),
                    knex('users_classes').insert({
                        user_id: 13,
                        class_id: 'INT311521-2016-2017'
                    }),
                    knex('users_classes').insert({
                        user_id: 13,
                        class_id: 'INT204421-2016-2017'
                    }),
                    knex('users_classes').insert({
                        user_id: 13,
                        class_id: 'PES102541-2016-2017'
                    }),

                    // Khanh
                    knex('users_classes').insert({
                        user_id: 14,
                        class_id: 'POL100111-2016-2017'
                    }),
                    knex('users_classes').insert({
                        user_id: 14,
                        class_id: 'MAT110031-2016-2017'
                    }),
                    knex('users_classes').insert({
                        user_id: 14,
                        class_id: 'INT220731-2016-2017'
                    }),
                    knex('users_classes').insert({
                        user_id: 14,
                        class_id: 'ELT203541-2016-2017'
                    }),
                    knex('users_classes').insert({
                        user_id: 14,
                        class_id: 'MAT110141-2016-2017'
                    }),
                    knex('users_classes').insert({
                        user_id: 14,
                        class_id: 'INT311521-2016-2017'
                    }),
                    knex('users_classes').insert({
                        user_id: 14,
                        class_id: 'INT204421-2016-2017'
                    }),
                    knex('users_classes').insert({
                        user_id: 14,
                        class_id: 'PES102541-2016-2017'
                    }),


                    // Thầy Khánh
                    knex('users_classes').insert({
                        user_id: 4,
                        class_id: 'INT311022-2016-2017'
                    }),
                    knex('users_classes').insert({
                        user_id: 4,
                        class_id: 'INT311032-2016-2017'
                    }),
                    // knex('users_classes').insert({
                    //     user_id: 4,
                    //     class_id: 'INT220731-2016-2017'
                    // }),
                    // knex('users_classes').insert({
                    //     user_id: 4,
                    //     class_id: 'ELT203541-2016-2017'
                    // }),
                    // knex('users_classes').insert({
                    //     user_id: 4,
                    //     class_id: 'MAT110141-2016-2017'
                    // }),
                    // knex('users_classes').insert({
                    //     user_id: 4,
                    //     class_id: 'INT311521-2016-2017'
                    // }),
                    // knex('users_classes').insert({
                    //     user_id: 4,
                    //     class_id: 'INT204421-2016-2017'
                    // }),
                    // knex('users_classes').insert({
                    //     user_id: 4,
                    //     class_id: 'PES102541-2016-2017'
                    // }),


                    // Cô Thuận
                    knex('users_classes').insert({
                        user_id: 11,
                        class_id: 'POL100111-2016-2017'
                    }),


                    // Thầy Khôi
                    knex('users_classes').insert({
                        user_id: 10,
                        class_id: 'INT204421-2016-2017'
                    }),


                    // Thầy Hà
                    knex('users_classes').insert({
                        user_id: 5,
                        class_id: 'ELT203541-2016-2017'
                    }),


                    // Cô Thanh
                    knex('users_classes').insert({
                        user_id: 6,
                        class_id: 'INT311521-2016-2017'
                    })


                ])
            }),



        // knex('posts').del()
        //     .then(function () {
        //         return Promise.all([
        //             knex('posts').insert({
        //                 id : 1,
        //                 user_id : 1,
        //                 class_id : 'INT20031-2016-2017',
        //                 title: 'Hoi ve Java',
        //                 content: 'Một interface không phải là một lớp. Viết một interface giống như viết một lớp, ' +
        //                 'nhưng chúng có 2 định nghĩa khác nhau. ' +
        //                 'Một lớp mô tả các thuộc tính và hành vi của một đối tượng. ' +
        //                 'Một interface chứa các hành vi mà một class triển khai.',
        //                 type: 'question',
        //                 description: 'desklsdjfklsjdfkljasdl jfalsdjf lasjdfl jasldfj alsjfl ajljasdlf jasldfj ',
        //                 tag: 'java',
        //                 is_incognito : false,
        //                 is_post_teacher : false,
        //                 is_solve : false,
        //                 created_at : now.toISOString()
        //             }),
        //             knex('posts').insert({
        //                 id : 2,
        //                 user_id : 1,
        //                 class_id : 'INT20031-2016-2017',
        //                 title: 'ok men',
        //                 content: 'Mặc dù vây, một interface khác với một class ở một số điểm sau đây, bao gồm:' +
        //                 'Bạn không thể khởi tạo một interface.' +
        //                 'Một interface không chứa bất cứ hàm contructor nào.' +
        //                 'Tất cả các phương thức của interface đều là abstract.' +
        //                 'Một interface không thể chứa một trường nào trừ các trường vừa static và final.' +
        //                 'Một interface không thể kế thừa từ lớp, nó được triển khai bởi một lớp.' +
        //                 'Một interface có thể kế thừa từ nhiều interface khác.',
        //                 description: 'desklsdjfklsjdfkljasdl jfalsdjf lasjdfl jasldfj alsjfl ajljasdlf jasldfj ',
        //                 type : 'note',
        //                 tag : 'interface',
        //                 is_incognito : false,
        //                 is_post_teacher : false,
        //                 is_solve : false,
        //                 created_at : now.toISOString()
        //             }),
        //             knex('posts').insert({
        //                 id : 3,
        //                 user_id : 1,
        //                 class_id : 'INT20031-2016-2017',
        //                 title: 'ok men',
        //                 content: 'Mặc dù vây, một interface khác với một class ở một số điểm sau đây, bao gồm:' +
        //                 'Bạn không thể khởi tạo một interface.' +
        //                 'Một interface không chứa bất cứ hàm contructor nào.' +
        //                 'Tất cả các phương thức của interface đều là abstract.' +
        //                 'Một interface không thể chứa một trường nào trừ các trường vừa static và final.' +
        //                 'Một interface không thể kế thừa từ lớp, nó được triển khai bởi một lớp.' +
        //                 'Một interface có thể kế thừa từ nhiều interface khác.',
        //                 description: 'desklsdjfklsjdfkljasdl jfalsdjf lasjdfl jasldfj alsjfl ajljasdlf jasldfj ',
        //                 type : 'note',
        //                 tag : 'interface',
        //                 is_incognito : true,
        //                 is_post_teacher : false,
        //                 is_solve : false,
        //                 created_at : now.toISOString()
        //             })
        //         ])
        //     }),
        //
        // knex('comments').del()
        //     .then(function () {
        //         return Promise.all([
        //             knex('comments').insert({
        //                 id : 1,
        //                 user_id: 1,
        //                 post_id: 3,
        //                 content: 'Day la 1 cai comment tu te!',
        //                 is_solve: 1,
        //                 created_at : now.toISOString()
        //             }),
        //             knex('comments').insert({
        //                 id : 2,
        //                 user_id: 1,
        //                 post_id: 1,
        //                 content: 'Day la 1 cai cmt tu te!',
        //                 is_solve: 0,
        //                 is_incognito : false,
        //                 created_at : now.toISOString()
        //             }),
        //             knex('comments').insert({
        //                 id: 3,
        //                 user_id: 1,
        //                 post_id: 3,
        //                 content: 'Day la 1 cai comment 2 tu te!',
        //                 is_solve: 0,
        //                 is_incognito : true,
        //                 created_at : now.toISOString()
        //             }),
        //             knex('comments').insert({
        //                 id : 4,
        //                 user_id: 1,
        //                 post_id: 1,
        //                 content: 'Day la 1 cai comment 3 tu te!',
        //                 is_solve: 0,
        //                 is_incognito : true,
        //                 created_at : now.toISOString()
        //             })
        //         ])
        //     }),
        //
        // knex('rep_comments').del()
        //     .then(function () {
        //         return Promise.all([
        //             knex('rep_comments').insert({
        //                 id : 1,
        //                 user_id: 1,
        //                 comment_id : 4,
        //                 content : 'ok men rep cmt sdflkjsdlfjsdlkfjskldfjklsdjf',
        //                 is_incognito: false,
        //                 created_at : now.toISOString()
        //             }),
        //             knex('rep_comments').insert({
        //                 id : 2,
        //                 user_id: 1,
        //                 comment_id : 4,
        //                 content : 'incognito ok men rep comment',
        //                 is_incognito: true,
        //                 created_at : now.toISOString()
        //             })
        //         ])
        //     }),
        //
        // knex('votes').del()
        //     .then(function () {
        //         return Promise.all([
        //             knex('votes').insert({
        //                 id : 1,
        //                 user_id: 1,
        //                 post_id: 1,
        //                 type : 'post',
        //                 up : true
        //             }),
        //             knex('votes').insert({
        //                 id : 2,
        //                 user_id: 1,
        //                 comment_id: 2,
        //                 type : 'comment',
        //                 up : true
        //             }),
        //             knex('votes').insert({
        //                 id : 3,
        //                 user_id: 2,
        //                 comment_id: 2,
        //                 type : 'comment',
        //                 up : true
        //             }),
        //             knex('votes').insert({
        //                 id : 4,
        //                 user_id: 3,
        //                 comment_id: 4,
        //                 type : 'comment',
        //                 up : true
        //             }),
        //             knex('votes').insert({
        //                 id : 5,
        //                 user_id: 1,
        //                 post_id: 3,
        //                 type : 'post',
        //                 up : false
        //             })
        //         ])
        //     }),

        // end
    ])
};
