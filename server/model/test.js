require("./db");
var facade = require("../facade/facade");

facade.addOrder({email:"aaccss"},[{"airline" : "test22", "fligthID" : 2, "tickesNo" : 3}], function(err,result){
   if(err){ console.log(err);}
    console.log(result);
});
