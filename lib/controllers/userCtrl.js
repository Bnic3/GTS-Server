/**
 * Created by john.nana on 7/9/2017.
 */

var userCtrl= function(User,Estate){

    var _ = require("lodash"),
        rek= require("rekuire"),

        moment = require("moment"),
        Utility= rek("utility")(),
        jwt = require('jsonwebtoken');

    var crypto = require("crypto");

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
                if(!residents){
                    return res.status(401).send({
                        success: false,
                        message: 'The specified estate has no residents.'
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
/*        Estate.findOne({eid:user.eid}, (err, doc)=>{
            if(err){return res.status(401).send({
                success: false,
                message: 'database error in estate findOne',
                error: err,
                notification: 'error'

            });
            }//end if
            else if(!err && (doc.unused_license == 0)){
                return res.status(401).send({
                    success: false,
                    message: 'sorry there is no available license',
                    error: err,
                    notification: 'error'

                });
            }
            else {
                // continue with user creation.
                user.token= Utility.tokenizer();
                user.t_exp= moment().add(20,'m').toDate();
                user.hash= hash(user.eid+user.phone, 'secretsalt'); // create  unique digital print

                if (req.body.status){user.status=req.body.status;} // user or admin

                user.save()
                    .then(function (doc) {
                        //Todo: decrease avail_license in estate
                        console.log(`Doc id is : ${doc.eid}`);
                        var conditions = {eid: doc.eid},
                            update = {$dec: {unused_license: 1}};

                        Estate.update(conditions, update, callback);

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
                            message: 'database error',
                            error: err,
                            notification: 'error'

                        });
                    }); //end catch chain


            }


        }); // end Estate findone*/

        //promisify creation of user
       var query= Estate.findOne({eid:user.eid});
        query.exec()
        .then((doc)=>{
                //to check for license
                console.log("in promise Estate findOne");
                if(doc.unused_license <= 0){
                    return res.status(401).send({
                        success: false,
                        message: 'sorry there is no available license',
                        error: err,
                        notification: 'error'

                    });
                }//end if
                else{
                    // continue with user creation.
                    user.token= Utility.tokenizer();
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

                 Estate.update(conditions, update, (err, edoc)=>{
                     console.log("in Estate update callback");
                     if (err){ console.log("error in updating ")}

                     if (!err){
                         console.log(edoc);
                         return res.status(200).send({
                             success: true,
                             message: 'user has been created',
                             notification: 'success'

                         }); //end return
                     }

                })

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
                    message: 'database error',
                    error: err,
                    notification: 'error'

                });
            }); //end catch chain

    }; //end create user.



    var deleteUser=(req,res)=>{
        var id = req.body.id;
        User.remove({_id : id}, (err,user)=>{
             if(err) return res.status(404).json(err);
            return res.json({ error:false, message:"User was deleted successfully" });
        })

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

    return {
        create: createUser,
        getResidents:getResidents,
        getOneResident:getOneResident,
        delete:deleteUser,
        update:updateUser
    }

}

module.exports= userCtrl;