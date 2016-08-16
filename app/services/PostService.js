'use strict';

const _ = require('lodash');
const request = require('request');
const Models = global.Models;
const helpers = global.helpers;
const config = helpers.config;

const API_FIREBASE_KEY = config('API_FIREBASE_KEY', '');

module.exports.getVotePost = function (post_id, callback) {
    new Models.Post({
        id: post_id
    }).fetch({withRelated: 'votes'}).then(function (post) {
        if (_.isEmpty(post)) {
            callback(0);
        }
        post = post.toJSON();
        let votes = post.votes;

        let vote_count = 0;
        for (var i = 0; i < votes.length; i++) {
            let vote = votes[i];
            if (vote.up == true) {
                vote_count++;
            } else {
                vote_count--;
            }
        }

        callback(vote_count);
    });
};

// module.exports.checkUserSeen = function (posts, user_id, callback) {
//     if (_.isEmpty(posts)) {
//         return callback(posts);
//     }
//
//     for (let i = 0; i < posts.length; i++) {
//         let post = posts[i];
//         new Models.Seen({
//             post_id: post.id,
//             user_id: user_id
//         })
//     }
// };

module.exports.pushNotiToStudent = function (classId, data) {
    console.log('push no ti');
    new Models.Class({
        id: classId
    }).fetch({withRelated: 'users.firebase_tokens'}).then(function (classSql) {
        classSql = classSql.toJSON();
        let users = classSql.users;
        for (var i = 0; i < users.length; i++) {
            let user = users[i];
            if (user.capability == 'student') {
                let firebaseTokens = user.firebase_tokens;
                for (var j = 0; j < firebaseTokens.length; j++) {
                    let firebaseToken = firebaseTokens[j];
                    if (firebaseToken.type == 'android') {
                        pushFirebaseNoti(API_FIREBASE_KEY, firebaseToken.token, data);
                    }
                }
            }
        }

    }).catch(function (err) {
        console.log(err);
    });
};

function pushFirebaseNoti(apiKey, deviceToken, data) {
    console.log('api key: ' + apiKey);
    console.log('device: ' + deviceToken);

    let urlReq = 'https://fcm.googleapis.com/fcm/send';

    let form = {
        to: deviceToken,
        // "notification": {
        //     "body": "This week's edition is now available.",
        //     "title": "NewsMagazine.com",
        //     "icon": "new"
        // },
        data: data
    };

    let authorHeader = 'key=' + apiKey;
    let param_post = {
        url: urlReq,
        headers: {
            'Authorization' : authorHeader,
            'Content-Type' : 'application/json'
        },
        form: form
    };

    request.post(param_post, function (err, response, body) {
        console.log(err);
        console.log(response);
    });
}












