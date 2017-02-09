'use strict';

/**
 * Auto load.
 */
require('../autoload');

/**
 * Models.
 */
global.Models = require('../models/Models');

let services = require('../app/services/all-service');
const helpers = global.helpers;

let SEED_CLASSES = [
    require('./seed_1.json'),
    require('./seed_2.json')
];

let insertStudentSuccess = 0;
let count = 0;

for (let subject_class of SEED_CLASSES) {
    for (let student of subject_class.students) {
        console.log(student);
        // console.log(subject_class.class_id);

        // insert student
        let birthday = helpers.time_validate.validateTime(student.birthday);

        services.user.insertNewStudentToDatabase2('', student.code, student.name, '', '',
            'student', birthday, student.regular_class,
            function (err, res) {
                if (!err) {
                    insertStudentSuccess++;
                    console.log(res);

                    services.user.userJoinClass(student.code, subject_class.class_id, function (err, res) {

                    });
                } else {
                    console.log(err);
                    console.log(res);
                }
                // count++;

                // if (count == subject_class.students.length) {
                //     console.log('insert_success: ' + insertStudentSuccess)
                // }
            });

        // insert student_class
    }
}