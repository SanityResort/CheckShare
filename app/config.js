'use strict';

var delim = process.platform == "win32" ? "\\" : "/"

var config = require('nodejs-config')(
     __dirname+delim+'..', function() {
       return process.env.NODE_ENV || 'dev';
     }
    );

module.exports = {
  api: config.get('api'),
  db: config.get('db'),
  mail: config.get('mail'),
  mailContent: config.get('mailContent'),
  main: config.get('main'),
  session: config.get('session')
}
