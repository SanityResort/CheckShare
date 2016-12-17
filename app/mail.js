'use strict'

var api = require('./config.js').api,
    mailConfig = require('./config.js').mail,
    mailContent = require('./config.js').mailContent,
    SendGrid = require('sendgrid-nodejs').SendGrid;

var baseUrl = api.protocol + "://" + api.host;

var send = function(mail, callback){
    new SendGrid(mailConfig.sendGrid.user, mailConfig.sendGrid.password).send(mail, callback);
}

var sendRegister = function(to, code, callback){
    var link = baseUrl+"/completeRegister?code="+code;

    var mail = {
        to: to,
        from: mailConfig.from,
        subject: mailContent.register.subject,
        text: `mailContent.register.body`
    }

    send(mail, callback);
}

module.exports = {
    sendRegister: sendRegister
}