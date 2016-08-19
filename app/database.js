'use strict';

var Sequelize = require('sequelize');

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

sequelize.sync()
  .then(function(err) {
    console.log('Initialized database layer.');
  }, function (err) { 
    console.log('An error occurred while creating the table:', err);
  });

module.exports = {
  user: User
}