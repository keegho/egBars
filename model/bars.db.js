/**
 * Created by M on 03-Jun-16.
 */
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var barsSchema = new Schema({
    name: {
        type: String,
        required: true,
        //timestamps: true
    },
    photo: Buffer,   //image
    address: {
        building: Number,
        street: String,
        area: String,
        state: String,
        city: String
    },
    phone: {
        mob: [Number],
        landline: [Number]
    },
    barType: String,
    ambient: String,
    options: {
        food: Boolean,
        localDrinksOnly: Boolean,
        noMinors: Boolean,
        minCharge: Number,
        lastOrder: String
    },
    loc: {
        type: [Number],   // [<longitude>, <latitude>]
        index: '2d',   // create the geospatial index
        required: true
    },
    created_at: Date,
    updated_at: Date

});

// To automaticaly update the updated and created fields pre every save
barsSchema.pre('save', function (next) {
    var currentDate = new Date();
    this.updated_at = currentDate;
    if(!this.created_at){
        this.created_at = currentDate;
    }
    next();
});


module.exports = mongoose.model('bar', barsSchema);

