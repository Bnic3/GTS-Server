/**
 * Created by john.nana on 7/16/2017.
 */

module.exports= function(Token){
    var _ = require("lodash"),
        moment = require("moment"),
        axios = require("axios"),
        rek = require("rekuire"),
        User= rek("User"),
        Log = rek("Log"),
        Utility= rek("utility")(),
        crypto = require("crypto"),
       jwt = require('jsonwebtoken');

    var secret = "supersecret";

    var hash = function(passwd, salt) {
        return crypto.createHmac('sha256', salt).update(passwd).digest('hex');
    };

    var createToken = (req, res)=>{
    var input = req.body; // effect input change in middleware
    var userOutput= {};
        userOutput.estate_sub =  req.estate_sub.exp;
        //perdiem, estate_sub

    //Todo: 1. token should contain host,eid, resident_number, guest, guest_number, comment)
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
                    throw new Error("sorry you have exhausted your daily token ");

                }//end if
                else{
                    // continue with token creation.
                    /*var code ="123456";*/
                    var code =Utility.tokenizer();
                    //generate a token

                    token.code = code;
                    token.hash= hash(`${token.eid}: ${token.code}`, "mysalt"); //fail safe
                    token.jwt_token= jwt.sign(input,secret, {
                        expiresIn: "1 days" // expires in 1 day
                    });

                    token.exp_date = moment().add(24,'h').toDate();
                    userOutput.perdiem = doc.daily_max;

                    return  token.save(); //return promise to the chain
                } //end else
        })

        .then(function(doc){
                //update useroutput with appropriate values
                userOutput.code=doc.code;
                userOutput.exp_date= moment(doc.exp_date);
                //userOutput.create_date;


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
            }//endIf
            else{

                console.error(err);

                return res.status(401).send({
                    success: false,
                    message: err.message,
                    error: "database Error",
                    notification: 'error'

                });
            }

        });
    //Todo: 2. create Logs for estates ( eid, Resident, guest, guest number)
    //Todo: 3. create database clean up feature
    //Todo: 4. need to clean all error throwing functions in all promises



    //eid, code,token,hash, exp_date

};

    var validateToken= (req, res)=>{
        //Todo: 1. validate token
        //eid, code
        var input = req.body;
        var decodedToken={};
        var query = Token.findOne({eid:input.eid,code: input.code}); //check for token
        query.exec()
        .then((doc)=>{
                if(doc==null){
                    console.log("Token doesnt exist");
                    console.log(doc);
                    throw new Error("Token doesnt exist or as been used")
                }else{

                    //verify token
                    //console.log(doc);
                    return new Promise((resolve,reject)=>{
                        jwt.verify(doc.jwt_token, secret,(err, decoded)=>{
                            if(err){console.log("fail to authenticate");
                                //console.log("exp_time: "+ doc.exp_date);
                                var reason = new Error(`Expired ${moment(doc.exp_date).fromNow()}`);
                                reject(reason); }
                            else{
                                decodedToken=decoded;
                                resolve(decoded);
                            }} );//verify
                        }); //end return promise;

                }//end outer else
        })
            .then((success)=>{

                console.log("in verify promise");
                console.log(success);

                var log = new Log();
                log = _.merge(log,success);
                return log.save();


            },(failure)=>{
                console.log("I am in failure");
                console.log(failure);
                throw failure;
                /*return res.status(401).send({
                    success: false,
                    message: 'token failed verification',
                    error: failure,
                    notification: 'error',
                    data: failure

                });*/
            })
            .then((success)=>{
                console.log("i am in logging save promise");
                //token removal
                return Token.remove({eid:input.eid, code: input.code}).exec()

            })

            .then((success)=>{
                console.log("i am in token delete");

                return res.status(200).send({
                    success: true,
                    message: 'token has been verified',
                    notification: 'success',
                    data:decodedToken

                }); //end return
            })
        .catch(function(err){
               // console.error(err);
                return res.status(401).send({
                    success: false,
                    message: err.message,
                    error: err,
                    notification: 'error'

                });
            })//end chain

        //Todo: 2. Notify user
        //Todo: 3. delete token
        //Todo: 4. update logs

    };


    return {
        create:createToken,
        validate: validateToken

    }
}
