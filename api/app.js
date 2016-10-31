var express = require("express");
var morgan = require("morgan");

var app = express();

app.use(morgan("short"));

app.get("/random/:min/:max", function(req, res, next){
    var min = parseInt(req.params.min);
    var max = parseInt(req.params.max);

    if(isNaN(min) || isNaN(max)){
        next();
        return;
    }
    
    var random = Math.random() * (max - min) + min;
    res.status(200).send({random : random});
});

app.use(function(req, res){
    res.status(400).send({"error" : "Wrong format"})
});

app.listen(3000, function(){
    console.log("App is listening at port : 3000");
})
