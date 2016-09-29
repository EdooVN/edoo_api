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
        {
            method: ['POST'],
            path: '/resfcm',
            config: controller.user.registerFirebaseToken
        },
        {
            method: ['GET'],
            path: '/usersolvevote',
            config: controller.user.getSolveVote
        },
        {
            method: ['GET'],
            path: '/profile',
            config: controller.user.getProfile
        },
        {
            method: ['POST'],
            path: '/profile',
            config: controller.user.updateProfile
        },
        {
            method: ['POST'],
            path: '/changepass',
            config: controller.user.changePassword
        },
        {
            method: ['POST'],
            path: '/sendresetpass',
            config: controller.user.sendResetPass
        },
        {
            method: ['POST'],
            path: '/resetpass',
            config: controller.user.resetPass
        },
        {
            method : ['POST'],
            path: '/avatar',
            config: controller.user.uploadAvatar
        },
        {
            method : ['GET'],
            path: '/classrank/{class_id}',
            config: controller.user.getClassRank
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
            config: controller.manager.addAClass
        },
        {
            method: ['POST'],
            path: '/joinclass',
            config: controller.manager.joinclass
        },
        {
            method: ['POST'],
            path: '/importexcel',
            config: controller.manager.addUserFromFileExel
        },

        /**
         * class
         */
        {
            method: ['GET'],
            path: '/classes',
            config: controller.class.getclass
        },
        {
            method: ['GET'],
            path: '/timetable',
            config: controller.class.getTimetable
        },

        /**
         * post
         */
        {
            method: ['GET'],
            path: '/posts/{class_id}',
            config: controller.post.getpost
        },
        {
            method: ['GET'],
            path: '/posts/{class_id}/page/{page_number}',
            config: controller.post.getPostsInPage
        },
        {
            method: ['POST'],
            path: '/post',
            config: controller.post.postPost
        },
        {
            method: ['POST'],
            path: '/updatepost',
            config: controller.post.updatePost
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
            path: '/deletecmt',
            config: controller.post.deleteCmt
        },
        {
            method : ['POST'],
            path: '/deletepost',
            config: controller.post.deletePost
        },
        {
            method : ['POST'],
            path: '/seen',
            config: controller.post.postSeen
        },
        {
            method : ['POST'],
            path: '/votepost',
            config: controller.post.postVote
        },
        {
            method : ['POST'],
            path: '/votecmt',
            config: controller.post.postVoteCmt
        },
        {
            method : ['POST'],
            path: '/devotecmt',
            config: controller.post.postDeVoteCmt
        },
        {
            method : ['POST'],
            path: '/unvotecmt',
            config: controller.post.postUnVoteCmt
        },
        {
            method : ['GET'],
            path : '/repcmt/{comment_id}',
            config : controller.post.getRepComments
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
            path: '/unsolve',
            config: controller.post.postUnSolve
        },
        {
            method : ['POST'],
            path: '/img',
            config: controller.post.uploadImage
        },
        {
            method : ['POST'],
            path: '/sendsupport',
            config: controller.post.postSupport
        },
        {
            method : ['POST'],
            path: '/upfileevent/{post_id}',
            config: controller.post.upFileToEvent
        },
        {
            method : ['GET'],
            path: '/checkevent/{post_id}',
            config: controller.post.checkEvent
        },
        {
            method : ['GET'],
            path: '/geteventfiles/{post_id}',
            config: controller.post.getUrlFileEvent
        }

    ]);
};

module.exports.register.attributes = {
    name: 'Fries Router',
    version: '1.0.0'
};