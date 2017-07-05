/**
 * Created by john.nana on 7/4/2017.
 */

var rekuire = require("rekuire"),
    mongoose = rekuire("database"),
    crypto = require("crypto"),
    uuid = require('node-uuid'),
    autoIncrement = require('mongoose-auto-increment');
    Schema = mongoose.Schema;


var EstateSchema = new Schema({
    eid: Number,
    e_name: String,
    sub_token: String,
    contact: String,
    last_sub: {type:Date, default: Date.now }

});

EstateSchema.plugin(autoIncrement.plugin,{
    model:"Estate",
    field:'eid',
    startAt:10,
    incrementBy:1});
module.exports = mongoose.model('Estate', EstateSchema);
