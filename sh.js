'use strict';

const crypto = require('crypto');

const secret = 'uetf.me';
const hash = crypto.createHmac('sha256', secret)
    .update('I love cupcakes')
    .digest('hex');
console.log(hash);