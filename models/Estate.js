/**
 * Created by john.nana on 7/4/2017.
 */

var rek = require("rekuire"),
    mongoose = rek("database"),
    crypto = require("crypto"),
    axios= require("axios"),
    User = rek("User");

    autoIncrement = require('mongoose-auto-increment');
    Schema = mongoose.Schema;


var EstateSchema = new Schema({
    eid: {type:Number,required: true, unique:true},
    e_name: String,
    sub_token: String,
    contact: String,
    country: {type:String, default: "" },
    contact_email:{
        type: String,
        required: true,
        trim: true,
        lowerCase:true,
        match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    },
    license: {type:Number, default:10},
    unused_license:{type:Number, default: 10},
    last_sub: {type:Date, default: Date.now },
    expiration_date:{type:Date},
    firebase_token:{type:String, default: "" }

});




EstateSchema.plugin(autoIncrement.plugin,{
    model:"Estate",
    field:'eid',
    startAt:10,
    incrementBy:1});






module.exports = mongoose.model('Estate', EstateSchema);
