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


var router = express.Router();

//DB Object


router.route('/api/token').post(TokenCtrl.create);
router.route('/api/token/test').get((req,res)=>{
    res.send("Token test");
});


/*

router.route('/api/users/:eid').get(UserCtrl.getResidents);

*/


module.exports = router;
