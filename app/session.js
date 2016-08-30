'use strict';

var bcrypt = require('bcryptjs'),
    dbConfig = require('./config.js').db,
    sessionConfig = require('./config.js').session,
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    session = require('express-session'),
    MySQLStore = require('express-mysql-session')(session);



var init = function(app, db)  {
  
  var options = {
    database: dbConfig.dbname,
    host: dbConfig.host,
    password: dbConfig.password,
    port: dbConfig.port,
    user: dbConfig.username,
    createDatabaseTable: true,
    schema: {
        tableName: 'sessions',
        columnNames: {
            session_id: 'session_id',
            expires: 'expires',
            data: 'data'
        }
    }
  }

  app.use(session({key: sessionConfig.key, secret: sessionConfig.secret, saveUninitialized: true, resave: true, store: new MySQLStore(options)}));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(new LocalStrategy(
      function(username, password, callback) {
        db.user.findOne({attributes: ['id', 'password'], where: {username: username}})
          .then(function(user){
          if (!user) {
            return callback(null, false, {message: 'Incorrect User'});
          }
          if (bcrypt.compareSync(password, user.password)) {
            return callback(null, {id: user.id});
          } else {
            return callback(null, false, {message: 'Incorrect Password'});
          }

        }, function(error){
          console.log('Error finding user "' + username + '": ' + error);
          return callback(error);
        });
      }
  ));

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
   db.user.findById(id).then(function(user) {
      done(null, user);
    }, function(err) {
         console.log('Error finding user for id "' + id + '": ' + err);
     done(err);
   });
  });
}

module.exports = {
  init: init
}