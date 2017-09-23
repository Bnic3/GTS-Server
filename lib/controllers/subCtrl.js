/**
 * Created by john.nana on 7/29/2017.
 */

var subCtrl = function(Subscription){
    var _ = require("lodash"),
        moment = require("moment"),
        axios = require("axios"),
        rek = require("rekuire"),
        User= rek("User"),
        Estate=rek("Estate"),
        Plan=rek("Plan"),
        moment= require("moment"),
        Schema= require("mongoose").Schema,

        jwt = require('jsonwebtoken');


    var subOptions= [
        { type:"daily", days: 1},
        { type:"monthly", days: 30},
        { type:"quarterly", days: 90},
        { type:"annually", days: 365+30}

    ];

    var BaseURL ="";
    if(process.env.ENV =="prod"){ BaseURL = process.env.BASEURL;}
    else {  BaseURL = "http://localhost:3000"; }


    var estateSub = (req, res)=>{
        var input = req.body;
        //eid/type/amount/phone
       // Todo:check if amount tallys with estate plan
        //Todo:
        subObj=subOptions[input.type];
        var sub = new Subscription();
        var oldDate= moment(req.estate_sub.exp_date); //from middleware
        sub.eid= input.eid;
        sub.type=subObj.type;
        sub.amount= input.amount;
        sub.phone= input.phone;

        sub.save()
        .then((doc)=>{
               console.log("in subscription save promise");
    // subscribe estate; update last_sub, expiration_date,sub_token;
                var payload = {};
                var ttl=0;
                payload.eid= input.eid;
                payload.last_sub= moment().toDate();

                //check conditions for rollover
                if(oldDate > moment()){
                    payload.expiration_date= moment(oldDate).add(subObj.days, "days"); //implement rollover
                    ttl = +(moment(oldDate).diff(moment(),'days'))+ subObj.days;
                } else{
                    payload.expiration_date= moment().add(subObj.days, "days");
                    ttl = subObj.days;
                }

                console.log("ttl::" + ttl);
                payload.sub_token= jwt.sign(input,process.env.SECRET, {
                    expiresIn: `${ttl} days`
                });

                var url= `${BaseURL}/api/update-estate`;
                return axios.post(url,payload);

        })
            .then((response)=>{
                console.log("in update estate axios");
                return res.status(200).send({
                    success: true,
                    message: 'Subscription successful',
                    notification: 'success'

                }); //end return
            }, (failure)=>{
                console.log("something went wrong in axios");
                throw new Error(failure);
            })
        .catch(function(err){
                // console.error(err);
                return res.status(401).send({
                    success: false,
                    message: err.message,
                    error: err,
                    notification: 'error'

                });
            });//end chain


    };


    var estatePlan =  ()=>{
    };

    return{
        estateSub: estateSub
    }
};


module.exports= subCtrl;