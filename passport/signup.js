/**
 * Created by M on 09-Jun-16.
 */
var localStrategy =  require('passport-local').Strategy;
var Account = require('../model/accounts.db');
var bCrypt = require("bcrypt-nodejs");

module.exports = function (passport) {
    passport.use('signup', new localStrategy ({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback: true
    }, function (req, email, password, done) {
        findOrCreateUser = function() {
            Account.findOne({
                'local.email': email
            }, function (err, account) {
                if (err){
                    console.log('Error while signing up ' + err);
                    return done(err);
                }
                //Account exists already
                if (account) {
                    console.log('Account already found. Choose another email.');
                    return done(null, false, req.flash('message', 'Account already exists'));
                } else {
                    //All is smooth create new account
                    var newAccount = new Account();
                    newAccount.local.email = email;
                    newAccount.local.password = generateHash(password);

                    newAccount.save(function(err){
                        if (err){
                            console.log('Error while saving account to database' + err);
                            throw err;
                        }
                        console.log('Congratulation new account is created for ' + email + '. Enjoy.');
                        return done(null, newAccount);
                    });
                }
            });
        };
        // Delay the execution of findOrCreateUser and execute
        // the method in the next tick of the event loop
        process.nextTick(findOrCreateUser);
    }));

    var generateHash = function (password) {
        return bCrypt.hashSync(password,bCrypt.genSaltSync(10), null);
    }
};