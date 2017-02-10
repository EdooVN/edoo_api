'use strict';

let fs = require('fs');
let readline = require('readline');
let google = require('googleapis');
let googleAuth = require('google-auth-library');
let config = global.helpers.config;

// 'https://www.googleapis.com/auth/plus.login',
let SCOPES = [
    'https://www.googleapis.com/auth/plus.me',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email'];

module.exports.getRedirectOAuthUrl = function (cb) {
    createOAuthClient(function (err, oauth2Client) {
        if (err) {
            return cb(err);
        } else {
            let url = oauth2Client.generateAuthUrl({
                access_type: 'offline',
                scope: SCOPES
            });

            cb(false, url);
        }
    })
};

function createOAuthClient(cb) {
    // Load client secrets from a local file.
    fs.readFile(__dirname + '/../../client_secret.json', function processClientSecrets(err, content) {
        if (err) {
            console.log('Error loading client secret file: ' + err);

            cb(err);
        }

        // Authorize a client with the loaded credentials, then call the Plus API.
        let credentials = JSON.parse(content);

        let clientSecret = credentials.installed.client_secret;
        let clientId = credentials.installed.client_id;
        let redirectUrl = credentials.installed.redirect_uris[0];
        let auth = new googleAuth();
        let oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

        cb(false, oauth2Client);
    });
}

module.exports.getUserInfo = function (code, cb) {
    createOAuthClient(function (err, oauth2Client) {

        oauth2Client.getToken(code, function (err, token) {
            if (err) {
                console.log('Error while trying to retrieve access token', err);
                return cb(err);
            }
            oauth2Client.credentials = token;
            let plus = google.plus('v1');

            plus.people.get({
                userId: 'me',
                auth: oauth2Client
            }, cb)
        });
    });
};