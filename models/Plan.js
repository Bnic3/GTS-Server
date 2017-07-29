/**
 * Created by john.nana on 7/5/2017.
 */

var rekuire = require("rekuire"),
    mongoose = rekuire("database"),
    crypto = require("crypto"),

    Schema = mongoose.Schema;


var PlanSchema = new Schema({
    eid: Number,
    monthly: Number,
    quaterly: Number,
    annually: Number,
    last_login: {type:Date}

});


module.exports = mongoose.model('Plan', PlanSchema);
