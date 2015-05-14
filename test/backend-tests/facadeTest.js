global.TEST_DATABASE = "mongodb://localhost/TestDataBase_xx1243";
require("../server/model/db");

var facade = require("../model/facade");
var mongoose = require("mongoose");
var Quotes = mongoose.model("quotes");
var User = mongoose.model("user");
var should = require("should");