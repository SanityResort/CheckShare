'use strict'

var api = require('config.js').api,
    mailConfig = require('config.js').mail,
    mailContent = require('config.js').mailContent,
    SendGrid = require('sendgrid-nodejs').SendGrid;

var baseUrl = api.protocol + "://" + api.host;

var send = function(mail){
    new SendGrid(mailConfig.user, mailConfig.password).send(mail);
}

var sendRegister = function(to, code){
    var link = baseUrl+"/completeRegister?code="+code;

    var mail = {
        to: to,
        from: mailConfig.from,
        subject: mailConfig.register.subject,
        text: `mailConfig.register.body`
    }

    send(mail);
}