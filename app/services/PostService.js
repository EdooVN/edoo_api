'use strict';

const _ = require('lodash');
const Models = global.Models;

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