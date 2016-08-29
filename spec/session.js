'use strict'

mock('./config', {db: {
  "dbname": "dbName",
  "dialect": "mariadb",
  "host": "host",
  "password": "password",
  "pool": {
    "idle": 10000,
    "max": 50,
    "min": 0
  },
  "port": 1234,
  "session": {
    "key": "session_cookie",
    "secret": "secret"
  },
  "username": "user"
}});


var session = require('../app/session');



var appMock = {use: function(){}}

session.init(appMock);