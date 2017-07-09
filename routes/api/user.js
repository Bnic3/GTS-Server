/**
 * Created by john.nana on 7/9/2017.
 */
var express = require('express');
var rek = require("rekuire");
var _ = require("lodash"),
    moment = require("moment"),
    Utility= rek("utility")(),
    jwt = require('jsonwebtoken');

var router = express.Router();

//DB Object
var DB = rek('database');

router.route('/api/user')
    .post(createUser);





function createUser(req,res){
    /*eid: Number,
        phone: String,
        token: String,
        r_name: String,
        status: String,
        t_exp
        daily_max: Number,*/

    var input = req.body;
    //eid, phone
    var User= DB.model("User");
    var user = new User();
    user = _.merge(user, input);
    user.token= Utility.tokenizer();
    user.t_exp= moment().add(20,'m').toDate();
    if (req.body.status){user.status=req.body.status}

    user.save((err,doc)=>{
        if (err) res.json({error: true, message: "there was an error saving user on the database"});
        if (!doc) res.json({error: true, message: "Could not save estate on the database"});


        return res.json({success:true, message:"User has been created"});
    });


}


module.exports = router;
