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

    var past = "2017-07-22T07:54:12.163Z";
    var dpast = new Date(past);
    var mpast = moment(past).endOf("day").fromNow();
    var mdpast = moment(dpast).fromNow();
    console.log("dpast"+ dpast);
    console.log("mpast"+ mpast);
    console.log("mdpast"+ mdpast);
    res.send("Token test");
});


/*

router.route('/api/users/:eid').get(UserCtrl.getResidents);

*/


module.exports = router;
