/**
 * Created by john.nana on 7/22/2017.
 */
/**
 * Created by john.nana on 7/9/2017.
 */

var express = require('express');
var rek = require("rekuire");

var Token = rek("Token");
var TokenCtrl = rek("tokenCtrl")(Token);
 var middleware = rek("middleware");



var router = express.Router();

//DB Object


router.post('/api/token',middleware.validateSub,TokenCtrl.create);
router.route('/api/token/validate').post(TokenCtrl.validate); //eid, code
router.route('/api/token/old').get(TokenCtrl.old);
router.route('/api/token/email').get(TokenCtrl.emailstring);
router.route('/api/token/nodemail').get((req, res)=>{
    var nodemailer = require('nodemailer');
    var xoauth2 = require('xoauth2');

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            xoauth2: xoauth2.createXOAuth2Generator({
                user: process.env.MAIL_USER,
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                refreshToken: process.env.REFRESH_TOKEN
            })
        }
    })

    var mailOptions = {
        from: process.env.MAIL_USER,
        to: process.env.RECEIVER,
        subject: 'Nodemailer test',
        text: 'Hello World!!'
    }

    transporter.sendMail(mailOptions, function (err, res) {
        if(err){
            console.log('Error');
        } else {
            console.log('Email Sent');
            res.send("Email Sent");
        }
    });

    // setup email data with unicode symbols
   /* let mailOptions = {
        from: '"Fred Foo ?" <foo@blurdybloop.com>', // sender address
        to: 'bar@blurdybloop.com, baz@blurdybloop.com', // list of receivers
        subject: 'Hello ?', // Subject line
        text: 'Hello world?', // plain text body
        html: '<b>Hello world?</b>' // html body
    };*/

   /* var transporter = nodemailer.createTransport({
        sendmail: true,
        newline: 'unix',
        path: '/usr/sbin/sendmail'
    });
    transporter.sendMail({
        from: 'sender@example.com',
        to: 'recipient@example.com',
        subject: 'Message',
        text: 'I hope this message gets delivered!',
        html: '<b>Hello world?</b>' // html body
    }, (err, info) => {
        console.log(info.envelope);
        console.log(info.messageId);
        res.send("I have sent the email");
    });*/

});

router.route('/api/token/test').get((req,res)=>{
    var moment = require("moment");

     var now = moment();
    var day = moment().add(1,"days");
    var diff = day-now;
    var testing = moment("2017-09-08T13:06:47.528Z");

    console.log("NOW:::" +now);
    console.log("DAY:::" +day);
    console.log("Dif:::" +diff);
    console.log("test:::" +moment().add(24,'h'));


});


/*

router.route('/api/users/:eid').get(UserCtrl.getResidents);

*/


module.exports = router;
