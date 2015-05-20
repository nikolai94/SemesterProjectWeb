var express = require('express');

var router = express.Router();
var request = require("request");
var facade = require("../facade/facade");
var facadeUser = require("../facade/facedeUser");
var async = require("async");
var bodyParser = require('body-parser');


router.get('/test', function(req, res) {
    res.header("Content-type","application/json");
    res.end('{"msg" : "Test Message fetched from the server, You are logged on as a User since you could fetch this data"}');
});

router.post('/addUser', function(req, res) {
    var newUser = req.body;

    facadeUser.createUser(newUser,function(err,result){
        if(err){
            return res.end(err);
        }

        return res.end(""+result);
    });
});

router.post('/reserve', function(req,res)
{
    var order = req.body;

    return res.end(order+ "");
})



router.get('/:fra/:til/:dato', function(req, res) {
    res.header("Content-type","application/json");

    var fra = req.params.fra;
    var til = req.params.til;
    var date = req.params.dato;

    var newDate = date.split("-");
    var dateUtc =  new Date(newDate[1]+"-"+newDate[0]+"-"+newDate[2]);
    dateUtc = dateUtc.valueOf();

    console.log(dateUtc);

   facade.getGrupper(fra,til,dateUtc,function(err,result){
       if(err){
           res.status(err.status || 400);
           res.end(JSON.stringify({error: err.toString()}));
           return;
       }

       res.end(JSON.stringify(result));

    });

});


router.get('/:fra/:dato', function(req, res) {
    res.header("Content-type","application/json");

    var fra = req.params.fra;
    var date = req.params.dato;

    var newDate = date.split("-");
    var dateUtc =  new Date(newDate[1]+"-"+newDate[0]+"-"+newDate[2]);
    dateUtc = dateUtc.valueOf();

    console.log(dateUtc);

    facade.getGrupperFromAirport(fra,dateUtc,function(err,result){
        if(err){
            res.status(err.status || 400);
            res.end(JSON.stringify({error: err.toString()}));
            return;
        }

        res.end(JSON.stringify(result));

    });

});

module.exports = router;
