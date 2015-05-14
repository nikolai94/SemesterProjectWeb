require("./../model/db");
var mongoose = require('mongoose');

var User = mongoose.model('User');
var brugerOpret = [
    {username: "bruger", email: "testLastName",password :"kode",address : "hejadresse",city:"hejby"}
];


/*
console.log(createUser(brugerOpret,function(err,datta)
{
    if(err)
    err
}));
*/
function createUser(data,callback){
    User.create(data,function(err,User){
        if(err){
            console.log(err);
            return callback(User);
        }

        callback(null,User);

    })
};

/*
getUser(function(err,datta)
{
    if(err) { return err}
    console.log(datta);
    return datta;
});

*/
function getUser(callback){
    User.find({}, function(err, data){

        if(err){
            return callback(err);}
        return callback(null ,data);

    });
}

checkIfUserExists("bruger","$2a$05$0SQWyUSZMt7cSNx7l/P87uIXLrXdLyYhUQj/X2ZaZIEU6n2e1Wa3S", function(err,data)
{
    if(err){
        return err;
    }
    console.log(data);
    return data;
})
function checkIfUserExists(user,password,callback){
    User.findOne({username : user },function(err,findUser){
        if(err) {
            return callback(err);
        }
        if(findUser != null && findUser.password === password){
            callback(null,true);
        } else
        {
            callback(null,false);
        }
    })
}
