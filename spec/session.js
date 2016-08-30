'use strict'
// define variables
var appSpy,
    bcrypt = require('bcryptjs'),
    db,
    expressSessionSpy,
    findStub,
    LocalStrategy = require('passport-local').Strategy,
    passportSpy,
    session;

// init mocks and spy objects
function MockStore() {}

appSpy = {use: sinon.spy()};

findStub = sinon.stub();

db = {
    user: {
        findOne: findStub
    }
};

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
      session.init(appSpy, db);
    });
    
    it('should call "app.use" 3 times', function() {
        expect(appSpy.use.callCount).to.be(3);
    });

    it('should initialize sessions in the correct order', function() {
        expect(expressSessionSpy.calledBefore(passportSpy.initialize)).to.be.ok();
        expect(passportSpy.initialize.calledBefore(passportSpy.session)).to.be.ok();
    });

    it('should call passport methods exactly once', function() {
        expect(passportSpy.deserializeUser.callCount).to.be(1);
        expect(passportSpy.initialize.callCount).to.be(1);
        expect(passportSpy.session.callCount).to.be(1);
        expect(passportSpy.serializeUser.callCount).to.be(1);
        expect(passportSpy.use.callCount).to.be(1);
    });

    it('should set LocalStrategy for authorization', function() {
        var call = passportSpy.use.getCall(0);
        expect(call.args[0]).to.be.a(LocalStrategy);
    });

    it('should set up LocalStrategy to authorize successfully for valid username and password', function(done) {
        var validId = "validId", password = 'password';
        var user = {
            id: validId,
            password: bcrypt.hashSync(password)
        };
        findStub.returns(Promise.resolve(user));
        var strategy = passportSpy.use.getCall(0).args[0];
        var callback = sinon.spy(function() {
            Promise.resolve().then(function(){
                expect(callback.called).to.be.ok();
                expect(callback.getCall(0).args).to.be.eql([null, {id: validId}]);
                done();
            });
        });
        strategy._verify('user', password, callback);
    });

    it('should set up LocalStrategy to fail authorization for invalid password', function(done) {
        var validId = "validId", password = 'password';
        var user = {
            id: validId,
            password: bcrypt.hashSync(password)
        };
        findStub.returns(Promise.resolve(user));
        var strategy = passportSpy.use.getCall(0).args[0];
        var callback = sinon.spy(function() {
            Promise.resolve().then(function(){
                expect(callback.called).to.be.ok();
                expect(callback.getCall(0).args).to.be.eql([null, false, {message: 'Incorrect User or Password'}]);
                done();
            });
        });
        strategy._verify('user', 'invalidPassword', callback);
    });

    it('should set up LocalStrategy to fail authorization if no user was found', function(done) {
        findStub.returns(Promise.resolve());
        var strategy = passportSpy.use.getCall(0).args[0];
        var callback = sinon.spy(function() {
            Promise.resolve().then(function(){
                expect(callback.called).to.be.ok();
                expect(callback.getCall(0).args).to.be.eql([null, false, {message: 'Incorrect User or Password'}]);
                done();
            });
        });
        strategy._verify(null, null, callback);
    });

    it('should set up LocalStrategy to propagate db error', function(done) {
        var error = {message: 'error'};
        findStub.returns(Promise.reject(error));
        var strategy = passportSpy.use.getCall(0).args[0];
        var callback = sinon.spy(function() {
            Promise.resolve().then(function(){
                expect(callback.called).to.be.ok();
                expect(callback.getCall(0).args).to.be.eql([error]);
                done();
            });
        });
        strategy._verify(null, null, callback);
    });
  });
});