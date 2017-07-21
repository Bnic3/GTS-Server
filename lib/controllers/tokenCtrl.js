/**
 * Created by john.nana on 7/16/2017.
 */

module.exports= function(Token){
    var _ = require("lodash"),
        moment = require("moment"),
        axios = require("axios"),
        rek = require("rekuire"),
        User= rek("User"),
       jwt = require('jsonwebtoken');

    var hash = function(passwd, salt) {
        return crypto.createHmac('sha256', salt).update(passwd).digest('hex');
    };
var createToken = (req, res)=>{
    var input = req.body;
    //Todo: 1. token should contain (residentname,estatename, resident_number, guest_name, Guest_number, comment)
    //Todo: 2. create Logs for estates ( eid, Resident, guest, guest number)
    //Todo: 3. create database clean up feature



    //eid, code,token,hash, exp_date

}
    return {
        create:createToken

    }
}
