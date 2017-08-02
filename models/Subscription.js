/**
 * Created by john.nana on 7/5/2017.
 */

var rekuire = require("rekuire"),
    mongoose = rekuire("database"),

    Schema = mongoose.Schema;


var SubscriptionSchema = new Schema({
    eid: String,
    amount: Number,
    sub_date: {type:Date, default:Date.now},
    type: String,
    phone: String

});

/*eref: {type: Schema.Types.ObjectId, ref:'Estate' },*/

module.exports = mongoose.model('Subscription', SubscriptionSchema);
