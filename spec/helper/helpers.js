'use strict'

process.env.NODE_ENV = 'test';
global.expect = require('expect.js');
global.mock = require('mock-require');
global.Promise = require('sequelize').Promise;
global.sinon = require('sinon');
