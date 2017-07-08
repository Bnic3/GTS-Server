/**
 * Created by john.nana on 7/8/2017.
 */
var express = require('express');
var rek = require("rekuire");
var _ = require("lodash"),
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

        console.log(req.body.contact);
        est.sub_token= jwt.sign(input,"supersecret", {
            expiresIn: "1m" // expires in 1 minute
        });


    jwt.verify(est.sub_token, "supersecret", function(err, decoded) {
     if (err) {
     return res.json({ success: false, message: 'Failed to authenticate token.' });
     } else {
     // if everything is good, save to request for use in other routes
     /* req.decoded = decoded;
     next();*/

     res.json({
     success: true,
     message: 'Enjoy your token!',
     token: est.sub_token,
     decoded:decoded
     });
     }
     });






}

module.exports= router;