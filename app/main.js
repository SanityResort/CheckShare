'use strict';
var express = require('express'),
    app = express(), 
    bcrypt = require('bcryptjs'),
    bodyParser = require('body-parser'),
    config = require('./config.js').main,
    db = require('./database.js'),
    passport = require('passport'),
    session = require('./session.js');

session.init(app, db);

app.listen(config.port);

app.use(bodyParser.json());

app.post('/login', passport.authenticate('local'),  function (req, res) {
  res.json(req.user);
});

app.post('/register', function (req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var pwhash = bcrypt.hashSync(password, config.saltsize);
  
  db.user.create({
    username: username,
    password: pwhash,
  }).then(function(user) {
    res.json({mesage: 'Created: ' + user});
  }, function(err) {
    res.json({message: 'Error: ' + err })
  });
  
  
});