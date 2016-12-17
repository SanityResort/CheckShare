'use strict'

var bcrypt = require('bcryptjs'),
    db = require('./database.js').user,
    saltsize = require('./config.js').main.saltsize;

var createUser = function(data){

   var username = data.username || data.email;
   var email = data.email;
   var password = data.password;
   var pwhash = bcrypt.hashSync(password, saltsize);
   var code = "dummycode"

console.log("Creating User");
  return db.create({
        email: email,
        username: username,
        password: pwhash
      }).then(function(user) {
      console.log("Created");
           return {email: email, code: code};
          });
}

module.exports = {
    createUser: createUser
}