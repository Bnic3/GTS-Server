/**
 * Created by john.nana on 7/4/2017.
 */

var rekuire = require("rekuire"),
    mongoose = rekuire("database"),
    crypto = require("crypto"),
    uuid = require('node-uuid'),
    autoIncrement = require('mongoose-auto-increment');
Schema = mongoose.Schema;


var TokenSchema = new Schema({
    eid: Number,
    code: String,
    token: String,


});


module.exports = mongoose.model('Token', TokenSchema);
