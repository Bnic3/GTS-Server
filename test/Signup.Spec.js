/**
 * Created by john.nana on 7/15/2017.
 */
var rek= require("rekuire");
var expect = require("chai").expect;
var request = require("supertest");
var app =rek("app");

var userBody={eid:1, phone: "08039704765", r_name: "Johnny"};
var EstateBody={e_name:"My Estate", contact:"777"};
process.env.ENV="test";

/*beforeEach();*/

describe("User Signup", function(){
    it(" /api/user Should allow users sign up ", function(done){
        request(app).post("/api/user").send(userBody).end(function(err, res){
            expect(res.status).to.equal(200);
            done();
        })

    });
    it("should create digital finger print for users ", (done)=>{
        var url = `/api/user/${userBody.eid}/${userBody.phone}`;
        request(app).get(url).end((err,res)=>{
            expect(res.body).to.have.property("hash");
            console.log(res.body);
            done();
        })
    });
    it("it should prevent duplicate user sign up");
    it("Signed up users should have a default of 20 vistors max")



});

describe("Estate Signup",function(){

    it("/api/estates Should allow Admin Signup Estate");
    it("Sign up process should automatically create admin users");
    it("Sign up Estates should have 30days expiration date");

});
