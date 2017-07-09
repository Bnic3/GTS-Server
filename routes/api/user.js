/**
 * Created by john.nana on 7/9/2017.
 */
var express = require('express');
var rek = require("rekuire");
var _ = require("lodash"),
    moment = require("moment"),
    Utility= rek("utility")
    jwt = require('jsonwebtoken');

var router = express.Router();

//DB Object
var DB = rek('database');

router.route('/api/estates')
    .post(createUser);

router.post("/testing",(req,res)=>{
    console.log(req.body.contact);
    res.send("post is working")
});



function createUser(req,res){
    /*eid: Number,
        phone: String,
        token: String,
        r_name: String,
        status: String,
        daily_max: Number,*/

    var input = req.body;
    //eid, phone
    var User= DB.model("User");
    var user = new User();
    user = _.merge(user, input);
    user.token= Utility.tokenizer();


}


module.exports = router;
