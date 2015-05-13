/**
 * Created by petersodborgchristensen on 13/05/15.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt-nodejs'),
    SALT_WORK_FACTOR = 10;

var UserSchema = new Schema({
    username: {type: String, required: true, index: {unique: true}},
    password: {type: String, required: true}
});

UserSchema.pre('save', function(next){
    var user = this;

    if(!user.isModified('password')) return next();

    //generer salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){
        if(err) return next(err);

        //hash password
        bcrypt.hash(user.password, salt, function(err, hash){
            if(err) return next(err);

            //override cleartext password med den hashede
            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function(candidatePassword, cb){
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch){
        if(err) return cb(err);
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('User', UserSchema);
