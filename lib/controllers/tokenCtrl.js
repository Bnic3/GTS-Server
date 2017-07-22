/**
 * Created by john.nana on 7/16/2017.
 */

module.exports= function(Token){
    var _ = require("lodash"),
        moment = require("moment"),
        axios = require("axios"),
        rek = require("rekuire"),
        User= rek("User"),
        Utility= rek("utility")(),
        crypto = require("crypto"),
       jwt = require('jsonwebtoken');

    var hash = function(passwd, salt) {
        return crypto.createHmac('sha256', salt).update(passwd).digest('hex');
    };

    var createToken = (req, res)=>{
    var input = req.body;
    //Todo: 1. token should contain (residentname,eid, resident_number, guest_name, Guest_number, comment)
    var token = new Token();

        token.eid=input.eid;


    //token = (verify)? token : compute again

    /*var code ="123456";*/
    var code =Utility.tokenizer();
     //generate a token

       /* Token.find({eid:String(token.eid),code:code}, function(err, data){
            if(!err){ console.log("!!code already exist");
                code= Utility.tokenizer();
                notValid=true;} //can find token
            else { notValid = false;} //cant find token

        });*/


    token.code = code;
    token.hash= hash(`${token.eid}: ${token.code}`, "mysalt"); //fail safe
    token.jwt_token= jwt.sign(input,"supersecret", {
        expiresIn: "1 days" // expires in 1 day
    });

    token.exp_date = moment().add(24,'h').toDate();



    token.save()
        .then(function(data){

            //Todo:create log
            return res.status(200).send({
                success: true,
                message: 'token has been created',
                notification: 'success',
                data:{code: data.code,
                        exp: data.exp_date,
                        create: data.create_date}

            }); //end return
        })
        .catch(function(err) {
            if(err.code === 11000){
                return res.status(401).send({
                    success: false,
                    message: 'Generated token already exists please try again',
                    error: err,
                    notification:'error'


                });
            } //endIf
            return res.status(401).send({
                success: false,
                message: 'database error',
                error: err,
                notification: 'error'

            });
        });
    //Todo: 2. create Logs for estates ( eid, Resident, guest, guest number)
    //Todo: 3. create database clean up feature



    //eid, code,token,hash, exp_date

}
    return {
        create:createToken

    }
}
