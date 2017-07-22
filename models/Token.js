/**
 * Created by john.nana on 7/4/2017.
 */

var rekuire = require("rekuire"),
    mongoose = rekuire("database"),
    crypto = require("crypto"),

    autoIncrement = require('mongoose-auto-increment');
Schema = mongoose.Schema;


var TokenSchema = new Schema({
    eid: Number,
    code: String,
    jwt_token: String,
    hash: {type: String, required: true, unique:true },
    create_date: {type:Date, default: Date.now },
    exp_date: Date


});


module.exports = mongoose.model('Token', TokenSchema);
