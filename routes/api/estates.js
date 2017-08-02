/**
 * Created by john.nana on 7/8/2017.
 */
var express = require('express');
var rek = require("rekuire");
//DB Object
var DB = rek('database');
var Estate= rek("Estate");

var EstateCtrl = rek("estateCtrl")(Estate);


var router = express.Router();




router.route('/api/estate').post(EstateCtrl.create);
router.route('/api/remove-estate').post(EstateCtrl.delete);
router.route('/api/update-estate').post(EstateCtrl.update);

router.get("/testing",(req,res)=>{
    /*console.log(moment().format("MMMM Do YYYY, h:mm:ss a"));*/
    var BaseURL ="";
    if(process.env.ENV =="prod"){ BaseURL = process.env.BASEURL;}
    else {  BaseURL = "http://localhost:3000"; }
    console.log(BaseURL);
    res.send("post is working")
});






module.exports= router;