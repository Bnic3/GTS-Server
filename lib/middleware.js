/**
 * Created by john.nana on 7/9/2017.
 */



var middleware = function (){
    var rek = require("rekuire"),
        Estate= rek("Estate"),
        moment= rek("moment"),
        Log = rek("Log"),
        jwt = require('jsonwebtoken');

    var validateSub= (req,res,next)=>{
        var salt= process.env.SALT;
        var input = req.body;
        req.estate_sub={};
        Estate.findOne({eid:input.eid}).exec()
        .then((doc)=>{
                if(doc == null){
                    throw new Error("Specified user estate doesn't exist ");
            }
                else {
                    req.estate_sub=doc;

                    return new Promise((resolve,reject)=>{
                        jwt.verify(doc.sub_token, salt, function(err, decoded) {
                            req.estate_sub.exp = moment(doc.expiration_date).fromNow();
                            if (err) {
                                console.log("Error happened here");
                                var reason = new Error(`Estate subscription expired ${moment(doc.expiration_date).fromNow()}`);
                                reject(reason);
                                /*return res.json({ success: false, message: 'Failed to authenticate token.' });*/
                            } else {
                                req.middleware={};
                                req.middleware.decoded = decoded;
                                resolve(req);
                                // if everything is good, save to request for use in other routes

                            }
                        });
                    });

                } //end outer else
        })
            .then((success)=>{
                console.log("i am in subscription promise success");
                next();
            }, (failure)=>{
                console.log("i am in subscription promise failure");
                throw failure;
            })
        .catch(function(err){
                // console.error(err);
                return res.status(401).send({
                    success: false,
                    message: err.message,
                    error: err,
                    notification: 'error'

                });
            })// end chain

    };


    return {
        validateSub: validateSub,

    }
};

module.exports= middleware();
