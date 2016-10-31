var express = require("express");
var path = require("path");
var zipdb = require("zippity-do-dah");
var ForecastIo = require("forecastio");

var app = express();
var weather = new ForecastIo("41b5669668ab2d582ecd67d3ac2704df");

app.use(express.static(path.resolve(__dirname, "public")))

app.set("views", path.resolve(__dirname,"views"));
app.set("view engine", "ejs");

app.get("/", function(req, res){
    res.render("index");
});

app.get(/^\/(\d{5})$/, function(req, res, next){
    var zipcode = req.params[0];
    var location = zipdb.zipcode(zipcode);

    if(!location){
        next();
        return;
    }

    var latitude = location.latitude;
    var longitude = location.longitude;
    weather.forecast(latitude, longitude).then(function(data){
        res.json({
            zipcode: zipcode,
            temperature: data.currently.temperature
        });
    }).catch(function(err){
        console.log(err);
        next();
        return;
    });
});

app.use(function(req, res){
    res.status(404).render("404");
})

app.listen(3000, function(){
    console.log("App is started at port 3000");
});
