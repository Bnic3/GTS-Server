var mongoose = require("mongoose"),
    mongooseTimestamps = require("mongoose-concrete-timestamps"),
    autoIncrement = require("mongoose-auto-increment"),
    Grid = require("gridfs-stream");


var DBConnection1= process.env.DEVDB;
 mongoose.connect( DBConnection1 );
var db = mongoose.connection;
db.on("error",function(errMsg){
    console.log("Error Connecting to Mongo: " + errMsg);
});
mongoose.set('debug', true);

//mongoose.plugin(mongooseTimestamps);
//autoIncrement.initialize(db);
module.exports = mongoose;