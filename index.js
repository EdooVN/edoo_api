'use strict';

/**
 * Environment variables.
 */
require('dotenv').config({
    path: '.env'
});

/**
 * Helper functions.
 */
global.helpers = require('./app/helpers/helpers');

/**
 * Models.
 */
global.Models = require('./models/Models');

/**
 * Main app.
 */
require('./app/main');