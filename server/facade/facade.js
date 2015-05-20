var mongoose = require('mongoose');
var User = mongoose.model('User');
var Gruppe = mongoose.model('Gruppe');
var async = require("async");
var request = require("request");


function getGrupper(fra,til,dateUtc,callback){

    Gruppe.find({}, function(err, data){
        if(err){return callback(err);}

        var tasks = [];
        var arr = [];

        for(var i =0; i<data.length; i++){
            tasks.push(getRequestFunction({
                url: data[i].link+"api/flights/"+fra+"/"+til+"/"+dateUtc,
                method: 'GET',
                json: true
            }));

        }

        async.parallel(tasks,function(err, results){
            if(err){console.log(err)};
            for(var i=0; i<results.length; i++){

                if(results[i] != undefined){
                    for(var j=0; j<results[i].length;j++){
                        arr.push({"airline":results[i][j].airline,"price":results[i][j].price,"flightId":results[i][j].flightId,"takeOffDate":results[i][j].takeOffDate,"landingDate":results[i][j].landingDate,"depature":results[i][j].depature,"destination":results[i][j].destination,"seats":results[i][j].seats,"availableSeats":results[i][j].availableSeats,"bookingCode":results[i][j].bookingCode});
                    }
                }
            }
            return callback(null ,arr);
        });



    });
}


function getGrupperFromAirport(fra,dateUtc,callback){

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
                        arr.push({"airline":results[i][j].airline,"price":results[i][j].price,"flightId":results[i][j].flightId,"takeOffDate":results[i][j].takeOffDate,"landingDate":results[i][j].landingDate,"depature":results[i][j].depature,"destination":results[i][j].destination,"seats":results[i][j].seats,"availableSeats":results[i][j].availableSeats,"bookingCode":results[i][j].bookingCode});
                    }
                }
            }
            return callback(null ,arr);
        });


    });
}


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

function addOrder(user,orderArr,callback){

    User.find({email:user.email},function(err,data){
        if(err){ return callback(err);}

        var newTickes = [];

        for(var i =0; i < data[0].tickes.length; i++){
            newTickes.push(data[0].tickes[i]);
        }
        var newArr = newTickes.concat(orderArr);
      //  var newObject = {username:data[0].username,email:data[0].email,salt:data[0].salt,hash:data[0].hash,address:data[0].address,city:data[0].city,tickes:newArr,created:data[0].created};
        User.update({email:user.email},{tickes:newArr},function(err,result){
            if(err){return callback(err);}
            return callback(err,result);
        })

    })
}




module.exports = {
    getGrupper : getGrupper,
    getGrupperFromAirport : getGrupperFromAirport,
    addOrder:addOrder

}