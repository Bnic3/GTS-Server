/**
 * Created by john.nana on 7/8/2017.
 */
var express = require('express');
var rek = require("rekuire");
var _ = require("lodash"),
    moment = require("moment"),
    jwt = require('jsonwebtoken');

var router = express.Router();

//DB Object
var DB = rek('database');

router.route('/api/estates')
    .post(createEstate);

router.post("/testing",(req,res)=>{
    console.log(req.body.contact);
    res.send("post is working")
});




function createEstate(req,res){
    var input = req.body;
    var Estate= DB.model("Estate");
    var decodedToken= null;

    var est = new Estate();
        est = _.merge(est, input);
    /*var mtime= moment().add(3,"days").calendar();
    var normal= moment().add(3,"days").toDate();
    var convert = moment(normal)*/

    est.expiration_date= moment().add(30, "days").toDate();
    est.sub_token= jwt.sign(input,"supersecret", {
            expiresIn: "1 days" // expires in 3 minute
        });


    est.save((err,doc)=>{
        if (err) res.json({error: true, message: "there was an error saving estate on the database"});
        if (!doc) res.json({error: true, message: "Could not save estate on the database"});
        //Todo: create the user as Admin

        return res.json({data:doc, error:false, message:"Estate has been created"});
    });

}

module.exports= router;