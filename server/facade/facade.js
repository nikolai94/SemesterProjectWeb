var mongoose = require('mongoose');
var User = mongoose.model('User');
var Gruppe = mongoose.model('Gruppe');

function getGrupper(callback){
    Gruppe.find({}, function(err, data){

        if(err){return callback(err);}
        return callback(null ,data);

    });
}






module.exports = {
    getGrupper : getGrupper
}