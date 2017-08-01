var mongoose = require("mongoose"),
    mongooseTimestamps = require("mongoose-concrete-timestamps"),
    autoIncrement = require("mongoose-auto-increment");


var DBConnection1= process.env.DEVDB;
var DBConnection2= process.env.TESTDB;
var DBConnection3= process.env.PRODDB;

if(process.env.ENV =="test"){mongoose.connect( DBConnection2 );}
else if(process.env.ENV =="DEV"){mongoose.connect( DBConnection1 );}
else if(process.env.ENV =="prod"){mongoose.connect( DBConnection3 );}

else{mongoose.connect( DBConnection1 );}


var db = mongoose.connection;
db.on("error",function(errMsg){
    console.log("Error Connecting to Mongo: " + errMsg);
});

db.on("open",function(connection){
    console.log("Database opened successfully: " );
});

mongoose.set('debug', true);

//mongoose.plugin(mongooseTimestamps);
autoIncrement.initialize(db);
module.exports = mongoose;