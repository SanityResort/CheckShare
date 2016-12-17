'use strict'

var registerReq = function(data) {
        var errors = [];
        if (!data.email) {
            errors.push("email was empty.");
        }
        if (data.email !== data.emailRepeat) {
            errors.push('Emails did not match.')
        }
        if (!data.password) {
            errors.push("Password was empty.")
        }
        if (data.password !== data.passwordRepeat) {
            errors.push('Passwords did not match.')
        }
        if (!data.password.match(/[a-z]/)) {
            errors.push('Password did not contain lower case letters.')
        }
        if (!data.password.match(/[A-Z]/)) {
            errors.push('Password did not contain upper case letters.')
        }
        if (!data.password.match(/[0-9]/)) {
            errors.push('Password did not contain numbers.')
        }
        if (!data.password.match(/[^A-Za-z0-9]/)) {
            errors.push('Password did not contain special letters.')
        }
        return errors;
}

module.exports = {
    registerReq: registerReq
}
