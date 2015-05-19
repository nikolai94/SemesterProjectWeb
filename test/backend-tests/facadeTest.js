global.TEST_DATABASE = "mongodb://localhost/TestDataBase_xx1243";
require("../../server/model/db");

var facade = require("../../server/facade/facedeUser");

var mongoose = require("mongoose");
var User = mongoose.model("User");
var should = require("should");

var brugerOpret = [
    {username: "bruger1", email: "email1tt",password :"kode1",address : "addresse1",city:"by1"},
    {username: "bruger2", email: "email2tt",password :"kode2",address : "addresse2",city:"by2"}
];


describe ('FacadeUser Test', function(){

    beforeEach(function (done){
        User.remove({}, function () {
            User.create(brugerOpret, function (err, brugere) {
                done();
            })
        });
    });
    after(function (done) {
        //Uncomment the lines below to completely remove the test database after the tests
        if (global.TEST_DATABASE) {
            mongoose.connection.db.dropDatabase();
        }
        done();
    });

    it("should insert a person and find it", function (done) {

        facade.createUser({username: "bruger3", email: "email3",password :"kode3",address : "addresse3",city:"by3"},function(err,datta)
        {
            //console.log("err "+err)
           // console.log("datta" + datta);
            datta.address.should.equal("addresse3");

            facade.getUser(function(err,data)
            {
                data.length.should.equal(3);
                done();
            });


        });

    });

    it("should find all users", function(done)
    {
        facade.getUser(function(err,data)
        {
            data.length.should.equal(2);
            done();
        });
    })

    it("should find a user with given username and pw", function(done)
    {
        facade.checkIfUserExists("bruger1","kode1",function(err,data)
        {
           // console.log(data);
            data.should.equal(false);
            done();
        });
    })


});
