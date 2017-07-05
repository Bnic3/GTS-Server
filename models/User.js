/**
 * Created by john.nana on 7/4/2017.
 */
var rekuire = require("rekuire"),
    mongoose = rekuire("database"),
    crypto = require("crypto"),
    uuid = require('node-uuid'),
    Schema = mongoose.Schema;


var UserSchema = new Schema({
    eid: Number,
    phone: String,
    token: String,
    r_name: String,
    status: String,
    daily_max: Number,
    last_login: {type:Date}

});


module.exports = mongoose.model('User', UserSchema);