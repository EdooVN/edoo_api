const Models = global.Models;
const schedule = require('node-schedule');

function tokenScheduler() {
    console.log('schedule');
    new Models.Token().fetchAll().then(function (tokens) {
        tokens = tokens.toJSON();
        for (var i=0; i<tokens.length; i++){
            let token = tokens[i];
            let timeExpire = token.time_expire;
            if (timeExpire < Date.now()){
                console.log('het han cmnr');
                new Models.Token({
                    id : token.id
                }).destroy();
            } else {
                console.log('con han');
            }
        }
    });
}

schedule.scheduleJob('*/5 * * * *', function () {
    console.log('ok men');
    tokenScheduler();
});