/**
 * Created by john.nana on 7/9/2017.
 */
var express = require('express');
var rek = require("rekuire");

var User = rek("User");
var Estate= rek("Estate");
var UserCtrl = rek("userCtrl")(User,Estate);


var router = express.Router();

//DB Object
var DB = rek('database');

router.route('/api/user').post(UserCtrl.create);
router.route('/api/user/:eid/:phone').get(UserCtrl.getOneResident);

router.route('/api/remove-user').post(UserCtrl.delete);
router.route('/api/update-user').post(UserCtrl.update);


router.route('/api/users/:eid').get(UserCtrl.getResidents);








module.exports = router;
