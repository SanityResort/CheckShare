'use strict';
var express = require('express'),
    app = express(), 
    bcrypt = require('bcryptjs'),
    bodyParser = require('body-parser'),
    session = require('./session.js'),
    db = require('./database.js');

session.init(app, db);

app.listen(80);

app.use(bodyParser.json()); // for parsing application/json

app.post('/login', passport.authenticate('local'),  function (req, res) {
  res.json(req.user);
});

app.post('/register', function (req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var saltsize = 8;
  var pwhash = bcrypt.hashSync(password, saltsize);
  
  db.user.create({
    username: username,
    password: pwhash,
  }).then(function(user) {
    res.json({mesage: 'Created: ' + user});
  }, function(err) {
    res.json({message: 'Error: ' + err })
  });
  
  
});