'use strict';

global.config = require('./config/server');
global.Model = require('./models/Models');

require('./app/main');