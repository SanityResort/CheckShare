'use strict';
var express = require('express'),
    app = express(), 
    bcrypt = require('bcryptjs'),
    bodyParser = require('body-parser'),
    config = require('./config.js').main,
    db = require('./database.js'),
    mail = require('./mail.js'),
    passport = require('passport'),
    Promise = db.instance.Promise,
    session = require('./session.js'),
    user = require('./user.js'),
    validate= require('./validate.js');

session.init(app, db);

app.listen(config.port);

app.use(bodyParser.json());

app.post('/login', passport.authenticate('local'),  function (req, res) {
  res.json(req.user);
});

app.get('/test', function(req, res){
    mail.sendRegister("huberc@butterbrot.org", "code", function(arg1, arg2, arg3) {
        console.log("arg1:" + arg1)
        console.log("arg2:" + arg2)
        console.log("arg3:" + arg3)
        res.sendStatus(200);
    })

});

app.post('/register', function (req, res) {

    var validatorPromise = Promise.promisify(function(data, callback){
        var errors = validate.registerReq(data);
        if (errors.length === 0) {
           return callback(null, data);
        }
        return callback(errors);
    });

    var mailPromise = Promise.promisify(mail.sendRegister);

   // return validatorPromise(req.body).then(function(result){
   return new Promise(function(resolve, reject){
   console.log("Start");
        var errors = validate.registerReq(req.body);
   console.log("Validated");
        if (errors.length === 0) {
           console.log("Success");

            resolve(req.body);
        } else {
           console.log("Error");

            reject(errors);
        }

   }).then(function(result){
      console.log("Create");

        return user.createUser(result);
    }, function(errors){
      console.log("Print validation error to response");
        res.json(JSON.stringify(errors));
        res.sendStatus(400);
    }).then(function(data){
      console.log("send mail");
        return new Promise(function(resolve, reject){
            mail.sendRegister(data.email, data.code, function(success, errors){
                if (success){
                    resolve();
                } else {
                    console.log("Error sending mail: "+ JSON.stringify(errors))
                    reject(new Error("Confirmation mail could not be sent"));
                }
            });
        });
    }, function(error){
      console.log("Print create error to response");
        res.json(error.message);
        res.sendStatus(409);
    }).then(function(){
      console.log("Set statis ok");
        res.sendStatus(200);
    }).catch(function(error) {
          console.log("Catch all: "+ error.message);

                     res.json(error);
                     res.sendStatus(500);
                 });
});

app.get('/logout', function(req, res){
  req.logout();
  res.sendStatus(200);
});