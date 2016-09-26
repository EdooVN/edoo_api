'use strict';

const XLSX = require('xlsx');

const FILE_PATH = '/Users/TooNies1810/Desktop/int2204(4).xlsx';

function pareAndInsertStudentToDatabase(filePath) {
    let workbook = XLSX.readFile(filePath);

    let sheet_name_list = workbook.SheetNames;

    let DSLMH_worksheet = workbook.Sheets['DSLMH'];

    let indexCollumEmail = '';
    let indexCollumCode = '';
    let indexCollumName = '';
    let indexCollumBirthday = '';
    let indexCollumClass = '';

// count rows and find index for email, code, name, birthday, regular_class
    let startRow = 0;
    let rowCount = 0;

    for (let z in DSLMH_worksheet) {
        /* all keys that do not begin with "!" correspond to cell addresses */
        if (z[0] === '!') continue;

        let value = DSLMH_worksheet[z].v;
        // let value = JSON.stringify(worksheet[z].v);
        console.log(z + "=" + value);

        let numbString = z.substring(1, z.length);
        let currRow = parseInt(numbString);
        if (currRow > rowCount) {
            rowCount = ++currRow;
        }

        if (value === 'email'){
            indexCollumEmail = z[0];
        }

        if (value === 'code'){
            indexCollumCode = z[0];
        }
        if (value === 'name'){
            indexCollumName = z[0];
        }
        if (value === 'birthday'){
            indexCollumBirthday = z[0];
        }
        if (value === 'class'){
            indexCollumClass = z[0];
            startRow = currRow;
        }
    }

// parse thong tin sinh vien
    let countStudent = 0;
    for (let i=startRow; i<rowCount; i++){
        // select each row for person
        try{
            let addressName = indexCollumName + i;
            let addressEmail = indexCollumEmail + i;
            let addressCode = indexCollumCode + i;
            let addressBirthday = indexCollumBirthday + i;
            let addressClass = indexCollumClass + i;

            let name = JSON.stringify(DSLMH_worksheet[addressName].v).trim();
            let email = JSON.stringify(DSLMH_worksheet[addressEmail].v).trim().toLowerCase();
            let code = JSON.stringify(DSLMH_worksheet[addressCode].v).trim().toLowerCase();
            let birthday = JSON.stringify(DSLMH_worksheet[addressBirthday].v).trim().toLowerCase();
            let regularClass = JSON.stringify(DSLMH_worksheet[addressClass].v).trim();

            console.log(email);
            console.log(code);
            console.log(name);
            console.log(birthday);
            console.log(regularClass);
            countStudent++;
            console.log('---------------');
        } catch (err){
            // console.log(err);
            continue;
        }
    }

    console.log(countStudent);
}

