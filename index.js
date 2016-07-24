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
global.helpers = require('./helpers/helpers');

/**
 * Models.
 */
global.Model = require('./models/Models');

/**
 * Main app.
 */
require('./app/main');