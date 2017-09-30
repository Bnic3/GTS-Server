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
        nunjucks= require("nunjucks"),
       jwt = require('jsonwebtoken');

    var fs = require('fs'),
        path = require('path');
    var pdf = require('html-pdf');

    var secret = "supersecret";

    var pdfMaker = {
        createPDF: function(html,options,destination){
            return new Promise((resolve,reject)=>{
                pdf.create(html, options).toFile( destination, function(err, response) {
                    if (err) { reject(err)}
                    else{ resolve(destination)}
                    /*res.send(html);*/ // { filename: '/app/businesscard.pdf' }
                });
            });
        }
    }; //end PDFMaker

    var hash = function(passwd, salt) {
        return crypto.createHmac('sha256', salt).update(passwd).digest('hex');
    };

    var createToken = (req, res)=>{
    var input = req.body; // effect input change in middleware
    var userOutput= {};
        userOutput.estateInfo={};
        userOutput.estateInfo=req.estate_sub;  //from middleware
        userOutput.estate_sub =  req.estate_sub.exp; //from middleware
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
                    userOutput.perdiem = doc.daily_max - 1;

                    return  token.save(); //return promise to the chain
                } //end else
        })

        .then(function(doc){
                //update useroutput with appropriate values
                userOutput.code=doc.code;
                userOutput.exp_date= moment().add(24,'h');
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
        //Todo: 4. update reports

    };

    var oldToken = (req,res)=>{
        var today = moment().startOf('day');
        var divide = moment(today).subtract(53,"days");
        var query = Token.find({create_date:{$lt: divide.toDate()}});
         query.exec()
        .then((doc)=>{
                 res.json(doc);
        })
        .catch((err)=>{
                 res.send("something went wrong");
        });

    };

    var history = (req,res)=>{

        var input = req.body;
        var end = moment().startOf('day');
        var startmonth = moment(end).subtract(1, "months");
        var start = moment(startmonth).startOf('month');
        console.log("Start::"+ start.toDate());
        console.log("Startmonth::"+ startmonth.toDate());
        console.log("End::"+ end.toDate());

        res.send("complete");
        /*var start = moment(end).startOf('month');
        var decodedToken={};
        var query = Token.findOne({eid:input.eid,code: input.code}); //check for token
        var query = Log.find({eid:input.eid});
        query.exec()*/






        /*var html = Utility.emalitemp();

        const sgMail = require('@sendgrid/mail');
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        const msg = {
            from: process.env.MAIL_USER,
            to: process.env.RECEIVER,
            subject: 'Sending with SendGrid is Fun',
            text: 'and easy to do anywhere, even with Node.js',
            html: html
        };
        sgMail.send(msg).then((success)=>{ res.send("Email was sent successfully")
        }, (failure)=>{
            console.log("i am in failure");
        });*/



    };


    var tokenlogs = (req,res)=>{

        var {eid} =req.params;
        var html = Utility.emalitemp();

        var options = { format: 'Letter' };
        var filedestination = `./reports/${eid}.pdf`;







    };

    var getReport = (req,res)=>{
        var {eid,e_name}= req.params;

        var options = { format: 'Letter' };
        var filedestination = `./reports/${eid}.pdf`;

        //for duration
        var end =moment();
        var endmonth =moment().startOf('day');
        var startmonth = moment(endmonth).subtract(1, "months");
        var start = moment(startmonth).startOf('month');

        var hstart = moment(start).format("MMMM Do YYYY, h:mm:ss a");
        var hend = moment(end).format("MMMM Do YYYY, h:mm:ss a");



        var query = Log.find({eid: eid,create_date:{$gte:start.toDate() ,$lt: end.toDate()}});
        query.exec()
        .then((logs)=>{
                var newlogs = logs.map((items)=>{
                    items.create_date= moment(items.create_date).format('MMMM Do YYYY, h:mm:ss a');
                    return items
                })
                console.log("iam in estate logs");
                /* var res = nunjucks.renderString(html,{estate: "Ajah",start:"1", end:"2",items:data2});*/
                var html=`<!DOCTYPE html> <html lang="en"> <head> <meta charset="UTF-8"> <title></title>   </head> <body>   <div class="content"> <div class="flex-head" > <img src="https://marketing-image-production.s3.amazonaws.com/uploads/198955841caef37c04e9605a5d5ba56ed4752e69a052da5a1eb2b6ab1d6843fd0782459f81181a8f723471e9e0925fb5304da4d39cb3512bb220815565dfcc6c.png" alt="brand" > <h2 class="teal"> Guest Records</h2> </div>  <div> <h4 class="teal">Estate Name: {{estate}} </h4> <p class="teal">Duration: {{start}} - {{end}} </p> </div> <div class="datagrid"> <!-- <table class="table table-striped"> <thead> <tr> <th>#</th> <th>Host  </th> <th>Guest</th> <th>Guest Number</th> <th>Comment</th> <th>Date</th> </tr> </thead> <tbody> {% for item in items %} <tr>  <th scope="row">{{loop.index}}</th> <td>{{item.hostname}}</td> <td>{{item.guest}}</td> <td>{{item.guest_number}}</td> <td>{{item.comment}}</td> <td>{{item.create_date}}</td>   </tr>  {% else %} <li>No data to display at this moment</li> {% endfor %}   </tbody> </table>-->   <div class="table">  <div class="row header"> <div class="cell"> # </div> <div class="cell"> Host </div> <div class="cell"> Guest </div> <div class="cell"> Guest Number </div> <div class="cell"> Comment </div> <div class="cell"> Date </div> </div>  {% for item in items %} <div class="row"> <div class="cell"> {{loop.index}} </div> <div class="cell"> {{item.hostname}} </div> <div class="cell"> {{item.guest}} </div> <div class="cell"> {{item.guest_number}} </div> <div class="cell"> {{item.comment}} </div> <div class="cell"> {{item.create_date}} </div> </div>  {% else %} <li>No data to display at this moment</li> {% endfor %}   </div>   </div>  </div>  <style> .content{ display: flex; flex-flow: column wrap; padding: 5px 5px 5px 5px;  } .flex-head{ display: flex;  } .teal{ color: #345161; }   body { font-family: "Helvetica Neue", Helvetica, Arial; font-size: 14px; line-height: 20px; font-weight: 400; color: #3b3b3b; -webkit-font-smoothing: antialiased; font-smoothing: antialiased; background: #2b2b2b; }  .wrapper { margin: 0 auto; padding: 40px; max-width: 800px; }  .table { margin: 0 0 40px 0; width: 100%; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2); display: table; } @media screen and (max-width: 580px) { .table { display: block; } }  .row { display: table-row; background: #f6f6f6; } .row:nth-of-type(odd) { background: #e9e9e9; } .row.header { font-weight: 900; color: #ffffff; background: #d32f2f; } .row.green { background: #27ae60; } .row.blue { background: #2980b9; } @media screen and (max-width: 580px) { .row { padding: 8px 0; display: block; } }  .cell { padding: 6px 12px; display: table-cell; } @media screen and (max-width: 580px) { .cell { padding: 2px 12px; display: block; } }       html { display: block; box-sizing: border-box; font-family: sans-serif; line-height: 1.15; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; -ms-overflow-style: scrollbar; -webkit-tap-highlight-color: transparent; }  body { margin: 0; font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif; font-size: 1rem; font-weight: 400; line-height: 1.5; color: #212529; background-color: #fff; }    </style>  </body>    </html>`;
                var dataobject = {estate:e_name.toUpperCase(), start:hstart, end:hend,items:newlogs};
                var report = nunjucks.renderString(html,dataobject);

                return pdfMaker.createPDF(report,options,filedestination)


        })
            .then((success)=>{
                console.log("i am in pdf promise success");
                console.log("Report in "+success);
                return res.status(200).send({
                    success: true,
                    message: 'Report has been generated',
                    notification: 'success',


                }); //end return
            },(failure)=>{
                console.log("i am in pdf promise failure");
                console.log(failure);
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
            })//end chain




    }

    var downloadreports= (req,res)=>{
        var {eid } = req.params;
        var oldname = `${eid}.pdf`;
      /*  var filePath = __dirname+`/reports/${eid}.pdf`;*/ // Or format the path using the `id` rest param
        var filePath = path.join('reports',oldname); // Or format the path using the `id` rest param
        console.log(filePath);
        /*var basepath= path.basename(filePath);
        console.log(basepath);*/
        var fileName = `estate_logs.pdf`; // The default name the browser will use

        res.download(filePath, fileName);
    };

    //housekeeping functions

    var updatePerdiem = (req,res)=>{

        User.find({}).exec()
            .then((residents)=>{
                residents.forEach((item)=>{
                    item.daily_max = 40;
                    item.save();
                });
                res.status(200).send({ success:true, message:"residents perdiem has been updated"});

            })
            .catch((err)=>{ return res.status(401).send({  success: false, error:err.message, message:"residents perdiem could not be updated"})});
    };

    var deleteTokens = (req,res)=>{
        var two_days_ago= moment().subtract(2,"days");
        var query = Token.find({create_date:{$lt: two_days_ago.toDate()}});
        query.exec()
        .then((tokens)=>{
                tokens.forEach((item)=>item.remove());
                res.status(200).send({ success:true, message:"old tokens have been deleted"});

        })

        .catch((err)=>{ return res.status(401).send({  success: false, error:err.message, message:"old tokens could not be removed"})});

    };

    var deleteLogs = (req,res)=>{
        var two_months_ago= moment().subtract(2,"months");
        console.log(two_months_ago);
        var query = Log.find({create_date:{$lt: two_months_ago.toDate()}});
        query.exec()
            .then((logs)=>{
                logs.forEach((item)=>item.remove());
                res.status(200).send({ success:true, message:"old logs have been deleted"});

            })

            .catch((err)=>{ return res.status(401).send({  success: false, error:err.message, message:"old logs could not be removed"})});

    };

    var deleteReports = (req, res)=>{
        var directory = "report";

        fs.readdir(directory, (err, files) => {
            if (err) throw console.error("Something went wrong...");

            for (const file of files) {
                fs.unlink(path.join(directory, file), err => {
                    if (err) console.error("there was an error deleting document");

                    console.log("deleting files...");

                });
            }
            res.status(200).send({ success:true, message:"houscleaning complete"});
        });

    };


    return {
        create:createToken,
        validate: validateToken,
        old: oldToken,
        history:history,
        tokenlogs:tokenlogs,
        getreports:getReport,
        downloadreports:downloadreports,

        updateperdiem:updatePerdiem,
        deleteTokens:deleteTokens,
        deleteLogs:deleteLogs,
        deletereport:deleteReports


    }
}
