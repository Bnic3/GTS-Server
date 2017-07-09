/**
 * Created by john.nana on 7/9/2017.
 */
var express = require('express');
var rek = require("rekuire");

var User = rek("User");
var UserCtrl = rek("userCtrl")(User);


var router = express.Router();

//DB Object
var DB = rek('database');

router.route('/api/user')
    .post(UserCtrl.create);








module.exports = router;
