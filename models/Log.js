/**
 * Created by john.nana on 7/21/2017.
 */

var rekuire = require("rekuire"),
    mongoose = rekuire("database"),
    crypto = require("crypto"),

    autoIncrement = require('mongoose-auto-increment');
Schema = mongoose.Schema;


var LogSchema = new Schema({
    eid: Number,
    host: String,
    guest: String,
    guest_number:String,
    comment: String,
    create_date: {type:Date, default: Date.now }


});


module.exports = mongoose.model('Log', LogSchema);
