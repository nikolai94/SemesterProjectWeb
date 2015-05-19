var express = require('express'),
    http = require('http'),
    path = require('path'),
    mongoose = require('mongoose'),
    hash = require('./pass').hash,
Schema = mongoose.Schema;

var router = express.Router();
var jwt = require('jsonwebtoken');
var facede = require("../facade/facedeUser")
//var User = require('../model/db');
//var session = require('express-session');


//router.use(session());

mongoose.connect("mongodb://localhost/semesterweb");
var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    salt: String,
    hash: String
});

var User = mongoose.model('users', UserSchema);



router.use(function (req, res, next) {
    var err = req.session.error,
        msg = req.session.success;
    delete req.session.error;
    delete req.session.success;
    res.locals.message = '';
    if (err) res.locals.message = '<p class="msg error">' + err + '</p>';
    if (msg) res.locals.message = '<p class="msg success">' + msg + '</p>';
    next();
});
/*
 Helper Functions
 */
function authenticate(name, pass, fn) {
    if (!module.parent) console.log('authenticating %s:%s', name, pass);

    User.findOne({
            username: name
        },

        function (err, user) {
            if (user) {
                if (err) return fn(new Error('cannot find user'));
                hash(pass, user.salt, function (err, hash) {
                    if (err) return fn(err);
                    if (hash == user.hash) return fn(null, user);
                    fn(new Error('invalid password'));
                });
            } else {
                return fn(new Error('cannot find user'));
            }
        });

}

function requiredAuthentication(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        req.session.error = 'Access denied!';
        res.redirect('/login');
    }
}

function userExist(req, res, next) {
    User.count({
        username: req.body.username
    }, function (err, count) {
        if (count === 0) {
            next();
        } else {
            req.session.error = "User Exist"
            res.redirect("/signup");
        }
    });
}

/* GET home page. */
router.get('/', function(req, res) {
  res.redirect("app/index.html");

    if (req.session.user) {
        res.send("Welcome " + req.session.user.username + "<br>" + "<a href='/logout'>logout</a>");
    } else {
        res.send("<a href='/login'> Login</a>" + "<br>" + "<a href='/signup'> Sign Up</a>");
    }
});

router.get("/", function (req, res) {

    if (req.session.user) {
        res.send("Welcome " + req.session.user.username + "<br>" + "<a href='/logout'>logout</a>");
    } else {
        res.send("<a href='/login'> Login</a>" + "<br>" + "<a href='/signup'> Sign Up</a>");
    }
});

router.get("/signup", function (req, res) {
    if (req.session.user) {
        res.redirect("/");
    } else {
        res.render("signup");
    }
});

router.post("/signup", userExist, function (req, res) {
//router.post("/signup", function (req, res) {
    var password = req.body.password;
    var username = req.body.username;
    var email = req.body.email;

    facede.opretUser(username,password,email,function(err,data){
        if(err){
            console.log(err);
            return res.end(""+err);
        }
        else{
            console.log(data);
            return res.end(""+data);
        }
    })
    /*hash(password, function (err, salt, hash) {
        if (err) throw err;
        var user = new User({
            username: username,
            salt: salt,
            hash: hash,
        }).save(function (err, newUser) {
                if (err) throw err;
                authenticate(newUser.username, password, function(err, user){
                    if(user){
                        req.session.regenerate(function(){
                            req.session.user = user;
                            req.session.success = 'Authenticated as ' + user.username + ' click to <a href="/logout">logout</a>. ' + ' You may now access <a href="/restricted">/restricted</a>.';
                            res.redirect('/');
                        });
                    }
                });
            });
    });*/
});

router.get("/login", function (req, res) {
    res.render("login");
});

router.post("/login", function (req, res) {
    authenticate(req.body.username, req.body.password, function (err, user) {
        if (user) {

            req.session.regenerate(function () {

                req.session.user = user;
                req.session.success = 'Authenticated as ' + user.username + ' click to <a href="/logout">logout</a>. ' + ' You may now access <a href="/#/view2">/view2</a>.';
                res.redirect('/');
            });
        } else {
            req.session.error = 'Authentication failed, please check your ' + ' username and password.';
            res.redirect('/login');
        }
    });
});

router.get('/logout', function (req, res) {
    req.session.destroy(function () {
        res.redirect('/');
    });
});






  //if is invalid, return 401
    /*
   if (req.body.username === 'user1' && req.body.password === 'test') {
       //tjek i database
    var profile = {
      username: 'user1',
      role: "user",
      id: 1000
    };
    // We are sending the profile inside the token
    var token = jwt.sign(profile, require("../security/secrets").secretTokenUser, { expiresInMinutes: 60*5 });
    res.json({ token: token });
    return;
  }

  if (req.body.username === 'admin1' && req.body.password === 'test') {
    var profile = {
      username: 'admin1',
      role: "admin",
      id: 123423
    };
    // We are sending the profile inside the token
    var token = jwt.sign(profile, require("../security/secrets").secretTokenAdmin, { expiresInMinutes: 60*5 });
    res.json({ token: token });
    return;
  }

  else{
    res.status(401).send('Wrong user or password');
    return;
  }
  */


//Get Partials made as Views

router.get('/partials/:partialName', function(req, res) {
  var name = req.params.partialName;
  res.render('partials/' + name);
});

module.exports = router;
