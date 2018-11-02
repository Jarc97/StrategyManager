
// Requires
var fs = require('fs');
var express = require('express');
require('isomorphic-fetch'); // or another library of choice.
var Dropbox = require('dropbox').Dropbox;
var path = require('path');
var DataBase = require("./DataBase.js").DataBase;

// Globals
var app = express();
var clients = [
    // {id: "db0", status: "DOWN", lastUpdate: 0},
    // {id: "db1", status: "DOWN", lastUpdate: 0},
    // {id: "db2", status: "DOWN", lastUpdate: 0}
];

var o = {};
const TYPES = ["full", "partial"];
function generateJsonStrategy(title, type, frecuency) {
    let data = {
        "title" : title,
        "type" : type,
        "frecuency" : frecuency
    };
    console.log(JSON.stringify(data));
    return JSON.stringify(data);
}

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


// Get all the databases being tracked in JSON format
app.get(API_URL, function (req, res) {
    res.contentType("application/json");
    res.json(clients);
});


// To register a new database to be tracked
app.get(API_URL + "/new" + "/:name", function (req, res) {
    let name = req.params.name;
    console.log("API: new database called " + name);
    res.contentType("application/json");
    if (clients.length < 4) {
        // clients.push({id: name, status: "OK", lastUpdate: 0, command: "no"});
        clients.push(new DataBase(name));
        res.json({status: true});
        console.log(clients);
    } else {
        res.json({status: false});
    }
});


// Called by admin when assigning a task (command) for a database
app.get(API_URL + "/task" + "/:t" + "/to" + "/:id", function (req, res) {
    console.log("API: task to called");
    task = req.params.t;
    to = req.params.id;
    for (var i = 0; i < clients.length; i++) {
        if (clients[i].id === to) {
            clients[i].command = task;
            res.json({status: true});
        }
    }
    res.json({status: false});
});


// Return a task to do for the database
app.get(API_URL + "/gettask" + "/:id", function (req, res) {
    reqId = req.params.id;
    for (var i = 0; i < clients.length; i++) {
        if (clients[i].id === reqId) {
            clientPendingCommand = clients[i].command;
            res.json({command: clientPendingCommand});
            // reset the pending command
            clients[i].command = "no";
        }
    }
});


app.get(API_URL + "/strat", function (req, res) {
    res.json({
        "command": "new",
        "database-name":"Aaron",
        "time-interval":15,
        "type":"complete",
        "tables":[],
        "complete-interval":0,
    });
});


app.get(API_URL + "/strat" + "/:name", function (req, res) {
    let n = req.params.name;
    for (var i = 0; i < clients.length; i++) {
        if (clients[i].strategy.database_name === n) {
            res.json(clients[i].strategy);
        }
    }
});


app.get(API_URL + "/setstrat" + "/:name" + "/:interval", function (req, res) {
    let n = req.params.name;
    let inter = req.params.interval;
    for (var i = 0; i < clients.length; i++) {
        if (clients[i].strategy.database_name === n) {
            clients[i].strategy.time_interval = inter;
            console.log(clients[i]);
        }
    }
});


// Reset the list of databases being tracked
app.get(API_URL + "/reset", function (req, res) {
    clients = [];
    res.contentType("application/json");
    res.json({status: true});
});


// Start the server
app.listen(PORT, function () {
    console.log('App listening on port ' + PORT);

    generateJsonStrategy("test_title", "full backup", 1200);
});

