
var fs = require('fs');
var express = require('express');
var Dropbox = require('dropbox').Dropbox;
var path = require('path');


var app = express();
// var dbx = new Dropbox({ accessToken: 'key here' });
var dbx = function() {
    let dropboxKeyPath = __dirname + "/../secret/dropbox_key.txt";
    fs.readFile(dropboxKeyPath, function(err, data) {
        if (err)
            return console.log("DROPBOX ERROR" + "\n" + err);
        let dropboxKey = data;
    });
    return new Dropbox({ accessToken: dropboxKey});
}

// app.use(express.static(__dirname + "/../LayerA/"), function(req, res, next) {
//     //console.log("Middleware for ALL requests");
//     next();
// });

// app.use("/api", function(req, res, next) {
//     console.log("Middleware for API requests");
//     // WIP: verify client
//     next();
// });
// app.use(express.static(__dirname + "/../LayerA/"));

const LAYER_A = __dirname + "/../LayerA/src"
const LAYER_B = __dirname

const INDEX_URL = "/"
const API_URL = "/api"
// look for PORT environment variable, else look for CLI argument, else use hard coded value for port 8080
const PORT = process.env.PORT || process.argv[2] || 8080;

app.set("view engine", "pug");

app.get(INDEX_URL, function (req, res) {
    console.log("GET routing for INDEX")
    let ip = req.header("x-forwarded-for");
    console.log("Accessed " + INDEX_URL + " from " + ip);
    // res.send('Administrador de estrategias de respaldo, Grupo 2');
    res.sendFile(path.join(__dirname + "/index.html"));
});


app.get(API_URL, function (req, res) {
    res.send("This is the api.");
});


app.listen(PORT, function () {
    console.log('App listening on port ' + PORT);
    console.log(LAYER_A);
});

