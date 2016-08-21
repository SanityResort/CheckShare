'use strict';

var delim = process.platform == "win32" ? "\\" : "/"

var config = require('nodejs-config')(
     process.argv[1].replace("app" + delim + "main.js", "")
    );

module.exports = {
  main: config.get('main'),
  db: config.get('db')
}
