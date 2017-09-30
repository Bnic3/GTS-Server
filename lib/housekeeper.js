/**
 * Created by john.nana on 9/23/2017.
 */
var rek = require("rekuire");
var Agenda = require("agenda");
var moment = require("moment");
var fs = require("fs"),
    path = require("path");


var Token = rek("Token"),
    User= rek("User"),
    Log = rek("Log");





var dbaddress ="";
var BaseURL ="";
if(process.env.ENV =="prod"){ BaseURL = process.env.BASEURL;
dbaddress= process.env.AGENDA_DBADDRESS;}
else {  BaseURL = "http://localhost:3000";
        dbaddress = 'localhost:27017/gts-test';}

var agenda = new Agenda({db: { address: `${dbaddress}`}});




agenda.define('test', function(job, done) {

    console.log("johnny is goody");
    done();
});


agenda.define('update-perdiem', function(job, done) {
    User.find({}, function(err, residents){
        if(err) {console.log("update perdiem failed");}

        residents.forEach((item)=>{
            item.daily_max = 40;
            item.save();
        });
        console.log("housekeeper: Updated perdiem!!!");
        done();

    });



});

agenda.define('delete-tokens', function(job, done) {

    var two_days_ago= moment().subtract(2,"days");
      Token.find({create_date:{$lt: two_days_ago.toDate()}}, function(err, tokens){
        if(err) console.log("something went wrong");

        tokens.forEach((item)=>item.remove());
        console.log("housekeeper: deleted tokens!!!");
        done();
    });



});


agenda.define('delete-logs', function(job, done) {

    var two_months_ago= moment().subtract(2,"months");
    /*console.log(two_months_ago);*/
     Log.find({create_date:{$lt: two_months_ago.toDate()}}, function(err,logs ){
         if(err) console.log("something went wrong");

         logs.forEach((item)=>item.remove());
         console.log("housekeeper: deleted logs!!!");
         done();

     });

});

agenda.define('delete-report', function(job, done) {
    var directory = "reports";

    fs.readdir(directory, (err, files) => {
        if (err)  console.error("Something went wrong...");

        console.log("checking report directory");
        for (var file of files) {
            fs.unlink(path.join(directory, file), err => {
                if (err) console.error("there was an error deleting document");

                console.log("deleting files...");

            });
        }
        console.log("housekeeper: deleted reports!!!");
        done();

    });



});






agenda.on('ready', function() {
    agenda.every('1 days', 'update-perdiem');
    agenda.every('7 days', 'delete-tokens');
    agenda.every('7 days', 'delete-logs');
    agenda.every('1 days', 'delete-report');
    /*agenda.every('20 seconds', 'test');*/

    agenda.start();
});