var express = require('express');

var router = express.Router();
var request = require("request");
var facade = require("../facade/facade");
var async = require("async");


router.get('/test', function(req, res) {
    res.header("Content-type","application/json");
    res.end('{"msg" : "Test Message fetched from the server, You are logged on as a User since you could fetch this data"}');
});

router.get('/:fra/:til/:dato', function(req, res) {
    res.header("Content-type","application/json");

    var fra = req.params.fra;
    var til = req.params.til;
    var date = req.params.dato;

    var newDate = date.split("-");
    var dateUtc =  new Date(newDate[1]+"-"+newDate[0]+"-"+newDate[2]);
    dateUtc = dateUtc.valueOf();

    var arr = [];
   facade.getGrupper(function(err,result){
       if(err){
           res.status(err.status || 400);
           res.end(JSON.stringify({error: err.toString()}));
           return;
       }
       var tasks = [];
       for(var i =0; i<result.length; i++){
            tasks.push(getRequestFunction({
                url: result[i].link+"api/flights/"+fra+"/"+dateUtc,
                method: 'GET',
                json: true
            }));
           console.log(result[i].link+"api/flights/"+fra+"/"+dateUtc);
       }
       async.parallel(tasks,function(err, results){
           for(var i=0; i<results.length; i++){
               if(results[i] != undefined){
                   for(var j=0; j<results[i].length;j++){
                       arr.push({"airline":results[i][j].airline,"price":results[i][j].price,"flightId":results[i][j].flightId,"takeOffDate":results[i][j].takeOffDate,"landingDate":results[i][j].landingDate,"depature":results[i][j].depature,"destination":results[i][j].destination,"seats":results[i][j].seats,"avaiableSeats":results[i][j].avaiableSeats,"bookingCode":results[i][j].bookingCode,Gruppe:3});
                   }
               }
           }
           res.end(JSON.stringify(arr));
       });
    });


});

function getRequestFunction(requestObj)
{
    return (function(callback)
    {
        request(requestObj, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                callback(null, body);
            }
            else {
                callback(error);
            }
        });
    });
}

module.exports = router;
