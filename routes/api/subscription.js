/**
 * Created by john.nana on 7/29/2017.
 */

var express = require('express');
var rek = require("rekuire");
//DB Object
var DB = rek('database');
var Subscription= rek("Subscription");

var SubCtrl = rek("subCtrl")(Subscription);


var router = express.Router();

router.post("/api/subscribe",SubCtrl.estateSub );

module.exports= router;
