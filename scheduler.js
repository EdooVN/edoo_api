'use strict';

const _ = require('lodash');
const Models = global.Models;
const schedule = require('node-schedule');

function tokenScheduler() {
    console.log('schedule');
    new Models.Token().fetchAll({withRelated: 'firebase_token'}).then(function (tokens) {
        tokens = tokens.toJSON();
        for (var i = 0; i < tokens.length; i++) {
            let token = tokens[i];
            let timeExpire = token.time_expire;
            if (timeExpire < Date.now()) {
                new Models.Token({
                    id: token.id
                }).destroy();

                console.log('token het han: ');

                if (!_.isEmpty(token.firebase_token)){
                    new Models.FirebaseToken({
                        id : token.firebase_token.id
                    }).destroy();
                    console.log('token_firebase het han: ');
                }
            }
        }
    });
}

schedule.scheduleJob('*/5 * * * *', function () {
    tokenScheduler();
});