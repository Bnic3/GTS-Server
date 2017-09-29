/**
 * Created by john.nana on 7/9/2017.
 */

var estateCtrl = function(Estate){

    var _ = require("lodash"),
        moment = require("moment"),
        axios = require("axios"),
        rek = require("rekuire"),
        User= rek("User"),
        Schema= require("mongoose").Schema,
        jwt = require('jsonwebtoken');

    var BaseURL ="";
    if(process.env.ENV =="prod"){ BaseURL = process.env.BASEURL;}
    else {  BaseURL = "http://localhost:3000"; }


     var createEstate= (req,res)=>{
                    var input = req.body;
                    var estateObj={}; //get estate object after creation.

                    var est = new Estate();
                    est = _.merge(est, input);


                    est.expiration_date= moment().add(14, "days").toDate();
                    //Todo:// don't forget to make token expire in 30day
                    est.sub_token= jwt.sign(input,"supersecret", {
                        expiresIn: "14 days" // expires in 3 minute
                    });

                    est.save()
                        .then(function(doc){
                                estateObj = doc;
                            //create the user as Admin
                            //eid, phone
                            var url= `${BaseURL}/api/user`;
                            console.log("BaseUrl : "+ url);
                            var options= {eid:doc.eid, phone:doc.contact,status:"admin"};
                            return axios.post(url,options);

                        })
                        .then((response)=>{
                            console.log("in axios user success ");
                            return res.status(200).send({ success:true, message:"Estate and Admin has been created(14 days TRIAL)", data: estateObj})},(failure)=>{
                            console.log("in axios user failure ");
                            console.log(failure);
                            throw new Error(failure);
                        })

                        .catch(function(err) {
                            if(err.code === 11000){
                                return res.status(401).send({
                                    success: false,
                                    message: 'Estate already exists',
                                    error: err,
                                    notification:'error'

                                });
                            } //endIf
                            return res.status(401).send({
                                success: false,
                                message: err.message,
                                data: estateObj,
                                error: err,
                                notification: 'error'

                            });
                        });

            } // end create estate

    var deleteEstate=(req,res)=>{
        var eid = req.body.eid;



        var query = Estate.remove({eid : eid});
         query.exec()
        .then((response)=>{return User.find({eid:eid}).exec() })
             .then((residents)=>{
                residents.forEach((item)=>item.remove());
                 res.status(200).send({ success:true, message:"Estate and its Users have been removed"})

             })
             .catch((err)=>{ return res.status(401).send({ error:err, message:"Estate and its users could not be deleted"})});
  }; // end delete users

    var updateEstate=(req,res)=>{

        var data = req.body;
        Estate.findOne({ eid:data.eid}, (err, item)=>{
            if(err) res.json({error:true, message:"there was an error in checking if this entry exists", status:"OK"});
            if (!err){
                Estate.update({ eid:data.eid }, data, { upsert:true }, function(err, estate){
                    if(err) return res.status(404).json(err);
                    return res.json({ success: true, message:'Estate was updated successful', payload:estate,status:"OK" });
                })
            } //end if
        }); //end findOne


    } //end update user

    var getEstates= (req,res)=>{
        /*var input = req.params;*/

        var query = Estate.find({});
        query.exec()
            .then((estates)=>{
                if(!estates || estates.length<=0){
                    return res.status(401).send({
                        success: false,
                        message: 'No available Estates.'
                    });
                }
                else {
                    return res.json(estates);
                }
            })

            .catch(function(err) {
                return res.status(403).send({
                    success: false,
                    message: 'An error occured getting residents.',
                    error: err
                });
            });

    };//list estates

    return {
        create:createEstate,
        delete:deleteEstate,
        update:updateEstate,
        getEstates:getEstates

    }
};

module.exports= estateCtrl;