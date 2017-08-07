/**
 * Created by john.nana on 7/9/2017.
 */

var userCtrl= function(User,Estate){

    var _ = require("lodash"),
        rek= require("rekuire"),
        axios = require("axios"),
        moment = require("moment"),
        Utility= rek("utility")(),
        jwt = require('jsonwebtoken');

    var crypto = require("crypto");

   /* const BaseURL = "http://localhost:3000";*/
    var BaseURL ="";
    if(process.env.ENV =="prod"){ BaseURL = process.env.BASEURL;}
    else {  BaseURL = "http://localhost:3000"; }

    var hash = function(passwd, salt) {
        return crypto.createHmac('sha256', salt).update(passwd).digest('hex');
    };

    var getOneResident= (req,res)=>{
        var input = req.params;
         var query = User.findOne({eid:input.eid, phone:input.phone});
        query.exec()
            .then((resident)=>{
                if(!resident){
                    return res.status(401).send({
                        success: false,
                        message: 'The specified user does not exist.'
                    });
                }
                else {
                    return res.json(resident);
                }
            })

            .catch(function(err) {
                return res.status(403).send({
                    success: false,
                    message: 'An error occured getting residents.',
                    error: err
                });
            });
    }

    var getResidents= (req,res)=>{
        var input = req.params;

        var query = User.find({eid:input.eid});
        query.exec()
        .then((residents)=>{
                if(!residents || residents.length<=0){
                    return res.status(401).send({
                        success: false,
                        message: 'The specified estate doesnt exist or has no residents.'
                    });
                }
                else {
                    return res.json(residents);
                }
        })

            .catch(function(err) {
                return res.status(403).send({
                    success: false,
                    message: 'An error occured getting residents.',
                    error: err
                });
            });

    };//list estate residence

    var createUser=(req,res)=>{

        var input = req.body;
        //eid, phone

        var user = new User();
        user = _.merge(user, input);
        //Todo: check if estate has available license


        //promisify creation of user
       var query= Estate.findOne({eid:user.eid});
        query.exec()
        .then((doc)=>{
                //to check for license
                console.log("in promise Estate findOne");
                if(doc.unused_license <= 0){
                    throw new Error('sorry your estate has no available license');

                }//end if
                else{
                    // continue with user creation.
                    user.token= Utility.usertokenizer();
                    user.t_exp= moment().add(20,'m').toDate();
                    user.hash= hash(user.eid+user.phone, 'secretsalt'); // create  unique digital print

                    if (req.body.status){user.status=req.body.status;} // user or admin

                    return  user.save(); //return promise to the chain
                }
        })
            .then((doc)=>{
                console.log("in promise user save");
                //Todo: decrease avail_license in estate
                console.log(`Doc id is : ${doc.eid}`);
                var conditions = {eid: doc.eid},
                    update = {$inc: {unused_license: -1}};

                return Estate.update(conditions,update).exec();

            })
            .then((edoc)=>{
                console.log(edoc);
                console.log("in Estate update promise");
                return res.status(200).send({
                    success: true,
                    message: 'user has been created',
                    notification: 'success'

                }); //end return
            })
            .catch(function (err) {
                if (err.code === 11000) {
                    return res.status(401).send({
                        success: false,
                        message: 'user already exists',
                        error: err,
                        notification: 'error'

                    });
                } //endIf
                return res.status(401).send({
                    success: false,
                    message: err.message,
                    error: err,
                    notification: 'error'

                });
            }); //end catch chain

    }; //end create user.



    var deleteUser=(req,res)=>{
        var input = req.body;
        var id = input._id;

        // promisify user deletion and to increase estate avail_license
        var query = User.remove({_id : id});
        query.exec()
        .then((res)=>{
            console.log("I am in remove promise");
                //todo: inc unused_license
                console.log(`estate id is : ${input.eid}`);
                var conditions = {eid: input.eid},
                    update = {$inc: {unused_license: 1}};

                return Estate.update(conditions,update).exec();
        }, (reject)=>{console.log("remove promise got rejected")})
            .then(()=>{
                console.log("I am in Estate update promise");
                return res.status(200).send({
                    success: true,
                    message: 'user has been deleted',
                    notification: 'success'

                }); //end return
            })
            .catch(function (err) {
                return res.status(401).send({
                    success: false,
                    message: 'database error',
                    error: err,
                    notification: 'error'

                });
            });//end chain
    }; // end delete users

    var updateUser=(req,res)=>{

        var data = req.body;
        User.findOne({ _id:data.id}, (err, item)=>{
            if(err) res.json({error:true, message:"there was an error in checking if this entry exists", status:"OK"});
            if (!err){
                User.update({ _id:data.id }, data, { upsert:true }, function(err, user){
                    if(err) return res.status(404).json(err);
                    return res.json({ error: false, message:'update successful', payload:user,status:"OK" });
                })
            } //end if
        }); //end findOne


    } //end update user

    var createMultiple = (req, res)=>{
        var input = req.body;
        var eid = input.eid;
        /*var numbers = input.payload;*/
        var numbers = ["111","222","333"];
        var processed = [];

        Estate.findOne({eid:input.eid}).exec()
        .then((doc)=>{
                if(doc == null){ throw new Error("Invalid Estate id")}
                else if (doc.unused_license< numbers.length){
                    throw new Error("Insufficient license")
                }
                else{
                    var payload={};
                    payload.eid= eid;
                    payload.unused_license = doc.license-numbers.length;

                    var url= `${BaseURL}/api/update-estate`;
                    return axios.post(url,payload);
                }
        })
        .then((response)=>{
            console.log("in update estate axios");
                // load numbers recursively;


                var promiseArr = numbers.map((number)=>{
                    var user = new User();
                    // continue with user creation.
                    user.eid = input.eid;
                    user.token= Utility.tokenizer();
                    user.t_exp= moment().add(20,'m').toDate();

                    user.phone= number;
                    user.hash= hash(user.eid+user.phone, 'secretsalt'); // create  unique digital print

                    return user.save();
                });
                return Promise.all(promiseArr);

        }, (failure)=>{
                console.log("something went wrong in axios");
                throw new Error(failure);
        })
            .then((values)=>{
                console.log("In promise all promise");
                console.log(values);
                return res.status(200).send({
                    success: true,
                    message: `${values.length} user(s) were created.`,
                    notification: 'success'

                }); //end return
            })
        .catch(function(err){
                 console.error(err);
                return res.status(401).send({
                    success: false,
                    message: err.message,
                    error: err,
                    notification: 'error'

                });
            }); //end chain


    };

    var OTPLogin = (req, res)=>{
        var input = req.body;
        var phone = input.phone;
        var eid = input.eid;

        User.findOne({eid:eid, phone: phone}).exec()
        .then((user)=>{
                if (user == null){ throw new Error("The resident is not a user in the specified estate");}
                else{
                    //create token and expiration time;
                    user.token= Utility.tokenizer();
                    user.t_exp= moment().add(20,'m').toDate();
                    return user.save();
                }
        })
        .then((success)=>{
                // in user save promise
                return res.status(200).send({
                    success: true,
                    message: 'user otp has been generated',
                    notification: 'success',
                    data: success

                });

        })
        .catch(function(err){
                console.error(err);
                return res.status(401).send({
                    success: false,
                    message: err.message,
                    error: err,
                    notification: 'error'

                });
            });



    };

    var OTPVerification= (req, res)=>{
        var input = req.body;
        var phone = input.phone;
        var eid = input.eid;
        var token = input.token;

        User.findOne({eid:eid, phone: phone,token:token }).exec()
            .then((user)=>{
                if (user == null){ throw new Error("Token has invalid");}
                else{
                    var elapse = moment(user.t_exp) - moment();
                     if(elapse < 0 ){
                         throw new Error("Your token is expired");
                     }
                    else {
                         //Todo: Send SMS to user
                         return res.status(200).send({
                             success: true,
                             message: 'user otp has been verified',
                             notification: 'success',
                             data: user

                         });
                     }


                } //end outer else
            })
            .catch(function(err){
                console.error(err);
                return res.status(401).send({
                    success: false,
                    message: err.message,
                    error: err,
                    notification: 'error'

                });
            });
    };


    return {
        create: createUser,
        getResidents:getResidents,
        getOneResident:getOneResident,
        delete:deleteUser,
        update:updateUser,
        createMultiple:createMultiple,
        otplogin:OTPLogin,
        otpverify:OTPVerification

    }

}

module.exports= userCtrl;