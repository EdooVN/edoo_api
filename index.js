'use strict';

/**
 * Auto load.
 */
require('./autoload');

/**
 * Models.
 */
global.Models = require('./models/Models');

/**
 * Main app.
 */
require('./app/main');

/**
 * Schedule: delete token expired
 */
require('./scheduler');