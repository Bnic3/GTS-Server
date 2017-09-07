/**
 * Created by john.nana on 7/22/2017.
 */
/**
 * Created by john.nana on 7/9/2017.
 */
var express = require('express');
var rek = require("rekuire");

var Token = rek("Token");
var TokenCtrl = rek("tokenCtrl")(Token);
 var middleware = rek("middleware");

var router = express.Router();

//DB Object


router.post('/api/token',middleware.validateSub,TokenCtrl.create);
router.route('/api/token/validate').post(TokenCtrl.validate); //eid, code
router.route('/api/token/test').get((req,res)=>{
    var moment = require("moment");

     var now = moment();
    var day = moment().add(1,"days");
    var diff = day-now;
    var testing = moment("2017-09-08T13:06:47.528Z");

    console.log("NOW:::" +now);
    console.log("DAY:::" +day);
    console.log("Dif:::" +diff);
    console.log("test:::" +testing);


});


/*

router.route('/api/users/:eid').get(UserCtrl.getResidents);

*/


module.exports = router;
