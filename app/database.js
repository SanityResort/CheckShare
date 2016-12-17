'use strict';

var config = require('./config.js').db,
    Sequelize = require('sequelize'),
    STATE_CREATED = "CREATED",
    STATE_ACTIVE = "ACTIVE";

var sequelize = new Sequelize(config.dbname, config.username, config.password, {
  dialect: config.dialect,
  host: config.host,
  password: config.password,
  pool: {
    max: config.pool.max,
    min: config.pool.min,
    idle: config.pool.idle
  }
});

var User = sequelize.define('user', {
    state: {type: Sequelize.ENUM(STATE_CREATED, STATE_ACTIVE), allowNull: false, defaultValue: STATE_CREATED},
    email: {type: Sequelize.STRING, allowNull: false, unique: true },
    username: {type: Sequelize.STRING, allowNull: false, unique: true },
    password: {type: Sequelize.STRING, allowNull: false},
    id: {type: Sequelize.UUID, allowNull: false, uniqe: true, defaultValue: Sequelize.UUIDV4, primaryKey: true}
}, {
    indexes: [
        {
            unique: false,
            fields: ['state']
        }
    ]
});

sequelize.sync()
  .then(function(err) {
    console.log('Initialized database layer.');
  }, function (err) { 
    console.log('An error occurred while creating the table:', err);
  });

module.exports = {
  instance: sequelize,
  user: User
}