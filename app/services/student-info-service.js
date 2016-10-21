'use strict';

const _ = require('lodash');
const XLSX = require('xlsx');
const userService = require('./user-service');
const helpers = global.helpers;

// for test
const FILE_PATH = '/Users/TooNies1810/Desktop/int2204(4).xlsx';

function pareAndInsertStudentToDatabase(filePath, cb) {
    let workbook = XLSX.readFile(filePath);

    let sheet_name_list = workbook.SheetNames;

    let DSLMH_worksheet = workbook.Sheets['DSLMH'];

    let indexCollumEmail = '';
    let indexCollumCode = '';
    let indexCollumName = '';
    let indexCollumBirthday = '';
    let indexCollumClass = '';

    // id of this subject class
    let classId = '';

    // count rows and find index for email, code, name, birthday, regular_class
    let startRow = 0;
    let rowCount = 0;

    for (let z in DSLMH_worksheet) {
        /* all keys that do not begin with "!" correspond to cell addresses */
        if (z[0] === '!') continue;

        let value = DSLMH_worksheet[z].v;
        // let value = JSON.stringify(worksheet[z].v);
        // console.log(z + "=" + value);

        let numbString = z.substring(1, z.length);
        let currRow = parseInt(numbString);
        if (currRow > rowCount) {
            rowCount = currRow + 1;
        }

        if (value === 'email') {
            indexCollumEmail = z[0];
        }

        if (value === 'code') {
            indexCollumCode = z[0];
        }
        if (value === 'name') {
            indexCollumName = z[0];
        }
        if (value === 'birthday') {
            indexCollumBirthday = z[0];
        }
        if (value === 'class') {
            indexCollumClass = z[0];
            startRow = ++currRow;
        }

        if (value === 'class_id') {
            let indexCollumClassId = z[0];

            let addressClassId = indexCollumClassId + (currRow + 1);
            classId = DSLMH_worksheet[addressClassId].v.trim().toUpperCase();
        }
    }

    // parse thong tin sinh vien
    let countStudent = 0;
    let insertStudentSuccess = 0;
    let count = 0;
    for (let i = startRow; i < rowCount; i++) {
        // select each row for person
        try {
            let addressName = indexCollumName + i;
            let addressEmail = indexCollumEmail + i;
            let addressCode = indexCollumCode + i;
            let addressBirthday = indexCollumBirthday + i;
            let addressClass = indexCollumClass + i;

            let name = DSLMH_worksheet[addressName].v.trim();
            let email = DSLMH_worksheet[addressEmail].v.trim().toLowerCase();
            let code = JSON.stringify(DSLMH_worksheet[addressCode].v).trim().toLowerCase();
            let birthday = DSLMH_worksheet[addressBirthday].v.trim().toLowerCase();
            let regularClass = DSLMH_worksheet[addressClass].v.trim();

            // console.log(email);
            // console.log(code);
            // console.log(name);
            // console.log(birthday);
            // console.log(regularClass);
            birthday = helpers.time_validate.validateTime(birthday);

            if (!_.isEmpty(email)) {
                userService.insertNewStudentToDatabase(email, code, name, '', '',
                    'student', birthday, regularClass,
                    function (err, res) {
                        if (!err) {
                            insertStudentSuccess++;
                            // console.log('success');

                            userService.userJoinClass(code, classId, function (err, res) {

                            });
                        }
                        count++;

                        if (count == countStudent) {
                            cb(false, {'insert_success': insertStudentSuccess, 'student_count': countStudent});
                        }
                    });
            }
            countStudent++;
            // console.log('---------------');
        } catch (err) {
            continue;
        }
    }
}

module.exports.pareAndInsertStudentToDatabase = pareAndInsertStudentToDatabase;