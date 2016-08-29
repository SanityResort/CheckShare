'use strict'

var expect = require('expect.js'),
    session = require('../app/session'),
    sinon = require('sinon');

var appMock;

beforeEach(function(){
  appMock = {use: sinon.spy()};
});

describe('Session', function() {
  
  describe('#init', function() {
    
    beforeEach(function(){
      session.init(appMock);
    });
    
    it('should call "use" 3 times', function() {    
      expect(appMock.use.callCount).to.be(3);     
    });
    
  });
  
  
});