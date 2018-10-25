
// Requires
var fs = require('fs');
var express = require('express');
require('isomorphic-fetch'); // or another library of choice.
var Dropbox = require('dropbox').Dropbox;
var path = require('path');

// Globals
var app = express();
var clients = [
    // {id: "db0", status: "DOWN", lastUpdate: 0},
    // {id: "db1", status: "DOWN", lastUpdate: 0},
    // {id: "db2", status: "DOWN", lastUpdate: 0}
];

function initDropbox() {
    let dropboxKeyPath = __dirname + "/../secret/dropbox_key.txt";
    let dropboxKey = fs.readFile(dropboxKeyPath, "utf8", function(err, data) {
        if (err)
            return console.log("DROPBOX ERROR" + "\n" + err);
        return data;
    });
    return dropboxKey;
}
var dropboxKey = initDropbox();
var dbx = new Dropbox({accessToken : dropboxKey});

// app.use(express.static(__dirname + "/../LayerA/"), function(req, res, next) {
//     //console.log("Middleware for ALL requests");
//     next();
// });

// app.use("/api", function(req, res, next) {
//     console.log("Middleware for API requests");
//     // WIP: verify client
//     next();
// });
app.use(express.static(__dirname + "/../LayerA/"));

const LAYER_A = __dirname + "/../LayerA"
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
    res.sendFile(path.join(LAYER_A + "/index.html"));
});


app.get(API_URL, function (req, res) {
    res.contentType("application/json");
    res.json(clients);
});


app.get(API_URL + "/new" + "/:name", function (req, res) {
    let name = req.params.name;
    console.log("API: new database called " + name);
    res.contentType("application/json");
    if (clients.length < 4) {
        clients.push({id: name, status: "OK", lastUpdate: 0});
        res.json({status: true});
        console.log(clients);
    } else {
        res.json({status: false});
    }
});

app.get(API_URL + "/reset", function (req, res) {
    clients = [];
    res.contentType("application/json");
    res.json({status: true});
});


app.listen(PORT, function () {
    console.log('App listening on port ' + PORT);
});

