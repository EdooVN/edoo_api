'use strict';

require('./autoload');
const _ = require('lodash');
const Models = require('./models/Models');

let classes = require('./seed/classes').classes;

console.log(typeof classes);

let semester = '1-2016-2017';

for (let i=0; i<classes.length; i++){
    let tempClass = classes[i];
    let codeClass = tempClass.code;
    codeClass = codeClass.replace(' ', '');
    let teacherClass = _.get(tempClass, 'teacher', '');
    let nameClass = _.get(tempClass, 'name', '');
    let studentCountClass = _.get(tempClass, 'student_count', 0);
    let creditCountClass = _.get(tempClass, 'soTin', 0);
    let dayOfWeekClass = _.get(tempClass, 'thu', 0);
    let periodClass = _.get(tempClass, 'tiet', '');
    let addressClass = _.get(tempClass, 'address', '');
    // let noteClass = tempClass.note;

    // console.log(tempClass);
    // console.log(codeClass);
    // console.log(teacherClass);
    // console.log(studentCountClass);
    // console.log(nameClass);
    // console.log(creditCountClass);
    // console.log(dayOfWeekClass);
    // console.log(periodClass);
    // console.log(addressClass);
    let id = (codeClass + semester);

    new Models.Class({
        id : id,
        code : codeClass,
        name : nameClass,
        type : 'subject',
        semester : semester,
        credit_count : creditCountClass,
        address : addressClass,
        day_of_week : dayOfWeekClass,
        period : periodClass,
        student_count : studentCountClass,
        teacher_name : teacherClass
    }).save(null, {method: 'insert'}).then(function (classSql) {
       console.log(classSql.toJSON());
    }).catch(function (err) {
        console.log(err);
    });
}

// new Models.Class().fetchAll().then(function (result) {
//     console.log(result.toJSON());
// });