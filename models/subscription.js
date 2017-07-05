/**
 * Created by john.nana on 7/5/2017.
 */

var rekuire = require("rekuire"),
    mongoose = rekuire("database"),

    Schema = mongoose.Schema;


var SubscriptionSchema = new Schema({
    eref: {type: Schema.Types.ObjectId, ref:'Estate' },
    amount: Number,
    sub_date: {type:Date}

});


module.exports = mongoose.model('Subscription', SubscriptionSchema);
