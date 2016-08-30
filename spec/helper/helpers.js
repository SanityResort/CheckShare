'use strict'

process.env.NODE_ENV = 'test';
global.expect = require('expect.js');
global.mock = require('mock-require');
global.sinon = require('sinon');
