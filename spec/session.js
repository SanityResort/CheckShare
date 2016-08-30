'use strict'
// define variables
var appSpy,
    expressSessionSpy,
    passportSpy,
    session;

// init mocks and spy objects
function MockStore() {}

appSpy = {use: sinon.spy()};

expressSessionSpy = sinon.spy();

passportSpy = {
    deserializeUser: sinon.spy(),
    initialize: sinon.spy(),
    session: sinon.spy(),
    serializeUser: sinon.spy(),
    use: sinon.spy()
}

// mock requirements
mock('express-session', expressSessionSpy);
mock('passport', passportSpy);
mock('express-mysql-session', function() {
    return MockStore;
});

// reset spies
beforeEach(function(){
    appSpy.use.reset();
    expressSessionSpy.reset();
    passportSpy.deserializeUser.reset();
    passportSpy.initialize.reset();
    passportSpy.session.reset();
    passportSpy.serializeUser.reset();
    passportSpy.use.reset();
});

// load module to test
session = require('../app/session.js');

describe('Session', function() {
  
  describe('#init', function() {
    
    beforeEach(function(){
      session.init(appSpy);
    });
    
    it('should call "use" 3 times', function() {
        expect(appSpy.use.callCount).to.be(3);
    });

    it('should initialize sessions in the correct order', function() {
        expect(expressSessionSpy.calledBefore(passportSpy.initialize)).to.be.ok();
        expect(passportSpy.initialize.calledBefore(passportSpy.session)).to.be.ok();
    });
  });
  
  
});