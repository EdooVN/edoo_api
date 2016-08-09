'use strict';

module.exports.register = (server, options, next) => {
    let controller = require('./../controllers/AllController');

    server.route([
        {//Any request OPTIONS
            path: '/{text*}',
            method: ['OPTIONS'],
            config: {
                handler: function(request, reply) {
                    return reply().code(204);
                }
            }
        },

        /**
         * User
         */
        {
            method: ['POST'],
            path: '/login',
            config: controller.user.loginPost
        },
        {
            method: ['GET'],
            path: '/logout',
            config: controller.user.logout
        },

        /**
         * Manager
         */
        {
            method: ['POST'],
            path: '/adduser',
            config: controller.manager.addUser
        },
        {
            method: ['POST'],
            path: '/addclass',
            config: controller.manager.addClass
        },
        {
            method: ['POST'],
            path: '/joinclass',
            config: controller.manager.joinclass
        },

        /**
         * class
         */
        {
            method: ['GET'],
            path: '/classes',
            config: controller.class.getclass
        },

        /**
         * post
         */
        {
            method: ['GET'],
            path: '/posts/{class_id?}',
            config: controller.post.getpost
        },
        {
            method: ['POST'],
            path: '/post',
            config: controller.post.postPost
        },
        {
            method: ['GET'],
            path: '/post/{post_id?}',
            config: controller.post.postDetail
        },
        {
            method : ['POST'],
            path: '/cmt',
            config: controller.post.postCmt
        },
        {
            method : ['POST'],
            path: '/votepost',
            config: controller.post.postVote
        },
        {
            method : ['POST'],
            path: '/votecomment',
            config: controller.post.postCmt
        },
        {
            method : ['GET'],
            path : '/repcmt/{comment_id}',
            config : controller.post.repComments
        },
        {
            method : ['POST'],
            path : '/repcmt',
            config : controller.post.postRepCmt
        },
        {
            method : ['POST'],
            path: '/solve',
            config: controller.post.postSolve
        },
        {
            method : ['POST'],
            path: '/img',
            config: controller.post.uploadImage
        }

    ]);
};

module.exports.register.attributes = {
    name: 'Fries Router',
    version: '1.0.0'
};