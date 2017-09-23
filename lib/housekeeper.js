/**
 * Created by john.nana on 9/23/2017.
 */
var rek = require("rekuire");
var Agenda = require("agenda");
var moment = require("moment");

var agenda = new Agenda({db: { address: 'localhost:27017/gts-test'}});

agenda.define('test', function(job, done) {

    console.log("johnny is goody");
    done();
});
agenda.define('test2', function(job, done) {

    console.log("Nana is bad");
    var now = moment().toDate();
    console.log(now);
    done();
});

agenda.on('ready', function() {
    agenda.every('1 minutes', 'test');
    agenda.every('20 seconds', 'test2');

    agenda.start();
});