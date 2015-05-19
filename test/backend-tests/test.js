global.TEST_DATABASE = "mongodb://localhost/TestDataBase_xx1243";


var should = require("should");
var app = require("../../server/app");
var http = require("http");
var testPort = 9999;
var testServer;
var mongoose = require("mongoose");
var User = mongoose.model("User");
var Gruppe = mongoose.model("Gruppe");
var nock = require("nock");
var facede = require("../../server/facade/facade");
var URL = "http://localhost:3000";



describe("API get flights",function(){
    before(function(done){
        global.SKIP_AUTHENTICATION = true;  //Skip security
        nock.enableNetConnect();
        var array = [{"airline":"FFn airlines","price":1337.37,"flightId":"22","takeOffDate":1430784000000,"landingDate":1430784000000,"depature":"CPH","seats":5,"bookingCode":false,"Gruppe":3},{"airline":"Lyn airlines","price":1000.37,"flightId":"28","takeOffDate":1430784000000,"landingDate":1430784000000,"depature":"CPH","seats":5,"bookingCode":false,"Gruppe":3}];
        nock(URL).get('/userApi/CPH/LON/05-01-2017').reply(200,array);
        done();
    });


    beforeEach(function(done){
        Gruppe.remove({}, function ()
        {
            var arrayNew = [{"gruppeNavn" : "Gruppe1", "link" : "http://smsproject-schultz.rhcloud.com/smsSemProject/"},
               {"gruppeNavn" : "Gruppe2", "link" : "http://semesterproject-testnikolai1.rhcloud.com/SemesterProjectFligths/"}];


            Gruppe.create(arrayNew,function(err,data){
                //if(err){ console.log(err);}
                //else{ console.log(data);}
                done();
            });
        });
    })




    describe("get Methods",function(){
        it("should get six flights",function(done){
            facede.getGrupper("CPH","LON","1430784000000",function(err,result){
                if(err){ console.log(err);}
              //  console.log(result[0] + " result")
                result.length.should.equal(5);
                done();
            });
        })
    })
    after(function(done){
        nock.restore();
        done();
    })
})
