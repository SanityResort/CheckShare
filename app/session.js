'use strict';

var bcrypt = require('bcryptjs'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    session = require('express-session');


var init(app, db) =  {
  app.use(session({secret: 'supernova', saveUninitialized: true, resave: true}));
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
  init: init;
}