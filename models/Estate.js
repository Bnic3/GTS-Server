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
    contact_email:{
        type: String,
        required: true,
        trim: true,
        lowerCase:true,
        match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    },
    license: {type:Number, default: 20},
    last_sub: {type:Date, default: Date.now },
    expiration_date:{type:Date}

});

/*EstateSchema.pre("remove", (next)=>{
    console.log("i am in pre hook")
    var eid = this.eid;
    var url = `/api/users/:${eid}`;
    axios.get(url).then((residents)=>{
        console.log("i am in axios")
        var residents_eid = residents.map(resident=>String(resident.eid));//convert residents eid to an array of strings
        console.log(residents_eid);
        User.remove({eid:{$in:residents_eid}}).exec();
    next();
    }); //end axios

});//end pre hook;*/


EstateSchema.plugin(autoIncrement.plugin,{
    model:"Estate",
    field:'eid',
    startAt:10,
    incrementBy:1});






module.exports = mongoose.model('Estate', EstateSchema);
