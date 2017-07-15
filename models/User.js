/**
 * Created by john.nana on 7/4/2017.
 */
var rekuire = require("rekuire"),
    mongoose = rekuire("database"),
    crypto = require("crypto"),

    Schema = mongoose.Schema;



var UserSchema = new Schema({
    eid: Number,
    phone: String,
    token: String,
    r_name: String,
    status: {type:String,default:"user"},
    daily_max:{type:Number,default:20},
    verified:{type:Boolean,default: false},
    t_exp: {type:Date},
    last_login: {type:Date,default: Date.now},
    hash: {type: String, required: true, unique:true }

});


module.exports = mongoose.model('User', UserSchema);