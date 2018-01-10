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

var Utility= rek("utility")();

var router = express.Router();

//DB Object


router.post('/api/token',middleware.validateSub,TokenCtrl.create);
router.route('/api/token/validate').post(TokenCtrl.validate); //eid, code
router.route('/api/token/old').get(TokenCtrl.old);
router.route('/api/token/history').get(TokenCtrl.history);
router.route('/api/token/reports/:eid/:e_name').get(TokenCtrl.getreports);
router.route('/api/token/downloadreports/:eid').get(TokenCtrl.downloadreports);
router.route('/api/token/testmail').get(TokenCtrl.testmail);

//house keeping functions

router.get("/api/housekeeping/updateperdiem", TokenCtrl.updateperdiem);
router.get("/api/housekeeping/deletetokens", TokenCtrl.deleteTokens);
router.get("/api/housekeeping/deleteLogs", TokenCtrl.deleteLogs);
router.get("/api/housekeeping/deletereport", TokenCtrl.deletereport);





module.exports = router;
