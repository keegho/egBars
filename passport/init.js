/**
 * Created by M on 09-Jun-16.
 */
var login = require('./login');
var signup = require('./signup');
var account = require('./../model/accounts.db');

module.exports = function (passport) {
    passport.serializeUser(function (account, done) {
        console.log("Serializing user " + account);
        done(null,account.id);
    });

    passport.deserializeUser(function (id, done) {
        account.findById(id, function (err, account) {
            console.log("Deserializing user " + account);
            done(err, account);
        });
    });

    login(passport);
    signup(passport);
};