var mongoose = require( 'mongoose' );
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

/*

Note:
To this test project as it is:

Start your MongoDB database.
Start mongo.exe and do:
  use testdb
  db.testusers.insert({userName : "Lars", email :"lam@cphbusiness.dk",pw: "test",created : new Date()})
  db.testusers.insert({userName : "Henrik", email :"hsty@cphbusiness.dk",pw: "test",created : new Date()})
  db.testusers.insert({userName : "Tobias", email :"tog@cphbusiness.dk",pw: "test",created : new Date()})
  db.testusers.insert({userName : "Anders", email :"aka@cphbusiness.dk",pw: "test",created : new Date()})

*/
var dbURI;

//This is set by the backend tests
if( typeof global.TEST_DATABASE != "undefined" ) {
  dbURI = global.TEST_DATABASE;
}
else{
  dbURI = 'mongodb://localhost/semprojdb';
}

mongoose.connect(dbURI);

mongoose.connection.on('connected', function () {
  console.log('Mongoose connected to ' + dbURI);
});

mongoose.connection.on('error',function (err) {
  global.mongo_error = "Not Connected to the Database";
  console.log('Mongoose connection error: ' + err);
});

mongoose.connection.on('disconnected', function () {
  console.log('Mongoose disconnected');
});

process.on('SIGINT', function() {
  mongoose.connection.close(function () {
    console.log('Mongoose disconnected through app termination');
    process.exit(0);
  });
});


var UsersSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    address: {
        type: String
    },
    city: {
        type: String
    },
    created: {
        type: Date,
        default: new Date()
    }
});

// compile our model
var Person = mongoose.model('Person', UsersSchema);

// create a document
var bad = new Person({
     username : 'Peter', email: 'sodborg@hotmail.com',
    password: 'peter123', address: 'tårnblæservej', city: 'Copenhagen', created: new Date()
});

console.log(bad.username + ' ' + bad.email + ' ' + bad.password + ' ' + bad.address + ' ' + bad.city);

//execute før hver user.save()
UsersSchema.pre('save', function(callback){
    var user = this;

    if(!user.isModified('password')) return callback;

    bcrypt.genSalt(5, function(err, salt){
        if(err) return callback(err);

        bcrypt.hash(user.password, salt, null, function(err, hash){
            if(err) return callback(err);
            user.password = hash;
            callback();
        });
    });
});


var GruppeSchema = new mongoose.Schema({
    gruppeNavn : {type: String, unique: true},
    link: String
});

module.exports = mongoose.model('User', UsersSchema);
module.exports = mongoose.model('Gruppe', GruppeSchema);

