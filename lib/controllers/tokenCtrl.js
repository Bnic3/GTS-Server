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
    var input = req.body; // effect input change in middleware
    var userOutput= {}

    //Todo: 1. token should contain (residentname,eid, resident_number, guest_name, Guest_number, comment)
    var token = new Token();

        token.eid=input.eid;
        token.phone= input.phone;
        //todo:2 user must have available token license and subtract

        var query= User.findOne({eid:input.eid, phone:input.phone});
        query.exec()
        .then((doc)=>{
                //to check for license
                console.log("in promise User findOne");
                if(doc.daily_max <= 0){
                    return res.status(401).send({
                        success: false,
                        message: 'sorry you have exhausted your daily token ',
                        error: err,
                        notification: 'error'

                    });
                }//end if
                else{
                    // continue with token creation.
                    /*var code ="123456";*/
                    var code =Utility.tokenizer();
                    //generate a token

                    token.code = code;
                    token.hash= hash(`${token.eid}: ${token.code}`, "mysalt"); //fail safe
                    token.jwt_token= jwt.sign(input,"supersecret", {
                        expiresIn: "1 days" // expires in 1 day
                    });

                    token.exp_date = moment().add(24,'h').toDate();

                    return  token.save(); //return promise to the chain
                } //end else
        })

        .then(function(doc){
                //update useroutput with appropriate values
                userOutput.code=doc.code;
                userOutput.exp_date= doc.exp_date;
                userOutput.create_date;

            //todo: decrease token license from user and update login date.
                console.log("in promise token save");
               console.log(`Doc id is : ${doc.eid}`);
                var last_login = moment().toDate();
               var conditions = {eid: doc.eid, phone: doc.phone},
                    update = {$inc: {daily_max: -1}, $set:{last_login:last_login}};

                return User.update(conditions,update).exec();


        })
        .then((success)=>{
                console.log("in promise user update");
            return res.status(200).send({
                success: true,
                message: 'token has been created',
                notification: 'success',
                data:userOutput

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
                console.error(err);
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

};

    var validateToken= (req, res)=>{
        //Todo: 1. validate token
        //Todo: 2. Notify user
        //Todo: 3. delete token
        //Todo: 4. update logs

    };
    return {
        create:createToken

    }
}
