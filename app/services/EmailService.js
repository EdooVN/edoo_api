'use strict';

let config = global.helpers.config;
const API_KEY_SENDGRID = config('API_KEY_SENDGRID', '');

const sg = require('sendgrid')(API_KEY_SENDGRID);

module.exports.sendRefreshPass = function (userDetail, token, cb) {
    let title = '[Edoo] Hướng dẫn khôi phục mật khẩu';

    let urlResetPass = 'http://uetf.me/#/reset-pass/' + token;
    // let content_html = '<a href="' + urlResetPass + '" target="_blank">' + '</a>';
    let content_html =
        '<p>' + 'Xin chào ' + userDetail.name + ',' + '</p>'
        + '<p>' + 'Bạn đã gửi một yêu cầu khôi phục mật khẩu cho tài khoản Edoo của mình. Để hoàn tất quá trình, vui lòng bấm vào đường dẫn dưới đây:' + '</p>'
        + '<p>' + '<a href="' + urlResetPass + '">' + 'Khôi phục mật khẩu' + '</a>' + '</p>'
        + '<p>' + 'Nếu bạn không muốn khôi phục mật khẩu, hãy bỏ qua email này.' + '</p>'
        + '<p>' + 'Hỗ trợ Edoo' + '</p>';
    sendEmail(userDetail.email, title, content_html, cb);
};

function sendEmail(email_user, title, content_html, callback) {
    let from = 'fries.uet@gmail.com';
    let to = email_user;

    var helper = require('sendgrid').mail;
    var from_email = new helper.Email(from);
    var to_email = new helper.Email(to);
    var subject = title;
    var content = new helper.Content('text/html', content_html);
    var mail = new helper.Mail(from_email, subject, to_email, content);

    var request = sg.emptyRequest({
        method: 'POST',
        path: '/v3/mail/send',
        body: mail.toJSON(),
    });

    sg.API(request, function (error, response) {
        // console.log('status code: ' + response.statusCode);
        // console.log(response.body);
        // console.log(response.headers);

        if (response.statusCode == 202) {
            callback(false);
        } else {
            callback(true);
        }
    });
}