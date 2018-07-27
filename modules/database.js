var mysql = require('mysql');
var appConfig = require('../config.js');
var pool = mysql.createPool(appConfig.db);
module.exports = pool;