'use strict';
var express = require('express'),
    app = express(), 
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    session = require('express-session'),
    bcrypt = require('bcryptjs'),
    bodyParser = require('body-parser'),
    Sequelize = require('sequelize'),
    Promise = Sequelize.Promise;


var sequelize = new Sequelize('testdb', 'root', 'root', {
  host: 'localhost',
  dialect: 'mariadb',

  pool: {
    max: 50,
    min: 0,
    idle: 10000
  }
});

var User = sequelize.define('user', {
    username: {type: Sequelize.STRING, allowNull: false, unique: true },
    password: {type: Sequelize.STRING, allowNull: false},
    id: {type: Sequelize.UUID, allowNull: false, uniqe: true, defaultValue: Sequelize.UUIDV4, primaryKey: true}
});

app.listen(80);

app.use(bodyParser.json()); // for parsing application/json
app.use(session({secret: 'supernova', saveUninitialized: true, resave: true}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
    function(username, password, callback) {
      console.log('Running find for ' + username);
      User.findOne({attributes: ['id', 'password'], where: {username: username}})
        .then(function(user){

        console.log("Found user: " + user);
        if (!user) {
          return callback(null, false, {message: 'Incorrect User'});
        }
        if (bcrypt.compareSync(password, user.password)) {
          return callback(null, {id: user.id});
        } else {
          return callback(null, false, {message: 'Incorrect Password'});
        }
          
      }, function(error){
        console.log("FindOne Error: " + error);
        return callback(error);
      });
    }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
     console.log("id: " + id);
 User.findById(id).then(function(user) {
    console.log("User: " + user);
    done(null, user);
  }, function(err) {
       console.log("Error: " + err);
   done(err);
 });
});


app.post('/login', passport.authenticate('local'),  function (req, res) {
  res.json(req.user);
});

app.post('/register', function (req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var saltsize = 8;
  var pwhash = bcrypt.hashSync(password, saltsize);
  
  User.create({
    username: username,
    password: pwhash,
  }).then(function(user) {
    res.json({mesage: 'Created: ' + user});
  }, function(err) {
    res.json({message: 'Error: ' + err })
  });
  
  
});

sequelize.sync()
  .then(function(err) {
    console.log('It worked!');
  }, function (err) { 
    console.log('An error occurred while creating the table:', err);
  });