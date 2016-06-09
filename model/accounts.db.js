var mongoose = require('mongoose');

var Schema = mongoose.Schema;
//var localPassport = require('passport-local-mongoose');

var accountSchema = new Schema ({
	local: {
		email: String,
		password: String
	},
	facebook: {
		id: String,
		token: String,
		email: String,
		name: String,
	},
	google: {
		id: String,
		token: String,
		email: String,
		name: String
	},
    apiKey: String,
    created_at: Date,
    updated_at: Date
});

// To automaticaly update the updated and created fields pre every save
accountSchema.pre('save', function (next) {
    var currentDate = new Date();
    this.updated_at = currentDate;
    if(!this.created_at){
        this.created_at = currentDate;
    }
    next();
});


module.exports = mongoose.model('accounts', accountSchema);