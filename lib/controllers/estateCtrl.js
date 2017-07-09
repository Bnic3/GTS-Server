/**
 * Created by john.nana on 7/9/2017.
 */

var estateCtrl = function(Estate){

    var _ = require("lodash"),
        moment = require("moment"),
        axios = require("axios"),
        jwt = require('jsonwebtoken');

    const BaseURL = "http://localhost:3000";


     var createEstate= (req,res)=>{
                    var input = req.body;
                    /*var Estate= DB.model("Estate");*/
                    

                    var est = new Estate();
                    est = _.merge(est, input);
                    /*var mtime= moment().add(3,"days").calendar();
                     var normal= moment().add(3,"days").toDate();
                     var convert = moment(normal)*/

                    est.expiration_date= moment().add(30, "days").toDate();
                    //Todo:// don't forget to make token expire in 30day
                    est.sub_token= jwt.sign(input,"supersecret", {
                        expiresIn: "1 days" // expires in 3 minute
                    });


                    est.save((err,doc)=>{
                        if (err) res.json({error: true, message: "there was an error saving estate on the database"});
                        /*if (!doc) res.json({error: true, message: "Could not save estate on the database"});*/

                        if (!err){

                            //create the user as Admin
                            //eid, phone
                            var url= `${BaseURL}/api/user`;
                            var options= {eid:doc.eid, phone:doc.contact,status:"admin"};

                            axios.post(url,options)
                                .then((response)=>{ return res.json({ success:true, message:"Estate and Admin has been created(30 days TRIAL)"});
                                })
                                .catch((error)=>{console.log("Estate was created but unable to create Admin");
                                    res.json({error: true, message: error});})

                        }// if there are no errors


                    });

            }

    return {
        create:createEstate

    }
};

module.exports= estateCtrl;