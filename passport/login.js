var localStrategy =  require('passport-local').Strategy;
var Account = require('./../model/accounts.db');
var bCrypt = require("bcrypt-nodejs");

module.exports = function (passport) {
    passport.use('login', new localStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback: true
    }, function (req, email, password, done){
        // check if user exists in database
        Account.findOne({
            'local.email': email
            }, function (err, account) {
                if (err) return done(err);
                //Account doesn't exist
                if (!account) {
                    console.log(email + " account is not found.");
                    return done(null, false, req.flash('message', 'Account not found...'));
                }
                //Check password validity
                if (!isValidPassword(account, password)) {
                    console.log(account.local.email + " sorry invalid password.");
                    return done(null, false, req.flash('message', 'Invalid password...'));
                }
                //All is perfect and passed
                console.log("Logged In");
                return done(null, account);
            }
        );
    }));

    //Password validity checker function
    var isValidPassword = function (account, password) {
        return bCrypt.compareSync(password, account.local.password);
    }
};