'use strict';

var delim = process.platform == "win32" ? "\\" : "/"

var config = require('nodejs-config')(
     process.argv[1].replace("app" + delim + "main.js", ""), function() { 
       return process.env.NODE_ENV || 'dev';
     }
    );

module.exports = {
  main: config.get('main'),
  db: config.get('db'),
  session: config.get('session')
}
