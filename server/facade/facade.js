var mongoose = require('mongoose');
var User = mongoose.model('User');
var Gruppe = mongoose.model('Gruppe');
var async = require("async");
var request = require("request");


function getGrupper(fra,til,dateUtc,callback){

    console.log(dateUtc);
    Gruppe.find({}, function(err, data){


        if(err){return callback(err);}

        var tasks = [];
        var arr = [];

        for(var i =0; i<data.length; i++){
            tasks.push(getRequestFunction({
                url: data[i].link+"api/flights/"+fra+"/"+dateUtc,
                method: 'GET',
                json: true
            }));

        }



        async.parallel(tasks,function(err, results){
            if(err){console.log(err)};
            for(var i=0; i<results.length; i++){

                if(results[i] != undefined){
                    for(var j=0; j<results[i].length;j++){
                        arr.push({"airline":results[i][j].airline,"price":results[i][j].price,"flightId":results[i][j].flightId,"takeOffDate":results[i][j].takeOffDate,"landingDate":results[i][j].landingDate,"depature":results[i][j].depature,"destination":results[i][j].destination,"seats":results[i][j].seats,"avaiableSeats":results[i][j].avaiableSeats,"bookingCode":results[i][j].bookingCode});
                    }
                }
            }
            return callback(null ,arr);
        });



    });
}



function getRequestFunction(requestObj,gruppeNavn)
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




module.exports = {
    getGrupper : getGrupper
}