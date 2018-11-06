
// Requires
var fs = require('fs');
var express = require('express');
require('isomorphic-fetch'); // or another library of choice.
var Dropbox = require('dropbox').Dropbox;
var path = require('path');
var DataBase = require("./DataBase.js").DataBase;
var bodyParser = require("body-parser")

// Globals
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extened: true
}));

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
// var dbx = new Dropbox({accessToken : dropboxKey});

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

// ============================== BASIC ==============================

// Start the server
app.listen(PORT, function () {
    console.log('App listening on port ' + PORT);
    setInterval(function() {
        checkStatus()
    }, 5000)
});


app.get(INDEX_URL, function (req, res) {
    console.log("GET routing for INDEX")
    let ip = req.header("x-forwarded-for");
    console.log("Accessed " + INDEX_URL + " from " + ip);
    res.sendFile(path.join(LAYER_A + "/index2.html"));
});



// ============================== SERVER FUNCTIONALITY ==============================

function checkStatus() {
    let tenSeconds = 10;
    let now = (new Date).getTime() / 1000;

    for (let i = 0; i < clients.length; i++) {
        // if (now - clients[i].lastPing > tenSeconds) {
        if (now - parseInt(clients[i].strategy.lastPing)) {
            clients[i].strategy.status = "DISCONNECTED";
        }
    }
}



// ============================== API ==============================

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


// Get the strategy of only one registered database
app.get(API_URL + "/strat" + "/:name", function (req, res) {
    let n = req.params.name;
    for (var i = 0; i < clients.length; i++) {
        if (clients[i].strategy.database_name === n) {
            res.json(clients[i].strategy);
        }
    }
});


// Set the strategy interval of an specific database
app.get(API_URL + "/setstrat" + "/:name" + "/:interval", function (req, res) {
    let n = req.params.name;
    let inter = req.params.interval;
    for (var i = 0; i < clients.length; i++) {
        if (clients[i].strategy.database_name === n) {
            clients[i].strategy.isNew = "1";
            clients[i].strategy.time_interval = inter;
            console.log(clients[i]);
        }
    }
});


// Called by the client (Python) and updates a database json to
// have the lastest log contents
app.post(API_URL + "/updatelog", function (req, res) {
    console.log("/updatelog called");
    console.log(req.body);
    let name = req.body.database_name;
    for (var i = 0; i < clients.length; i++) {
        if (clients[i].strategy.database_name === name) {
            clients[i].strategy = req.body;
            console.log(req.body);
            res.json({"status": true});
            // return;
        }
    }
    // res.json({"status": false});
});


app.get(API_URL + "/ping" + "/:name", function (req, res) {
    let name = req.params.name;
    for (let i = 0; i < clients.length; i++) {
        if (clients[i].strategy.database_name === name) {
            //clients[i].lastPing = (new Date).getTime()/1000;
            clients[i].setLastPing((new Date).getTime() / 1000);
            clients[i].strategy.status = "OK";
            res.json({"status": true});
        }
    }
});



// ============================== HELPERS ==============================

app.get(API_URL + "/strat", function (req, res) {
    res.json({
        "isNew": true,
        "database_name": name,
        "status": "OK",
        "time_interval":4,
        "type":"complete",
        "tables":[],
        "complete-interval":0,
        "log_name": "",
        "log_content": ""
    });
});


app.post(API_URL + "/testpost", function(req, res) {
    let number = req.body.number;
    console.log(number);
    res.json({"status": true});
})


// Reset the list of databases being tracked
app.get(API_URL + "/reset", function (req, res) {
    clients = [];
    res.contentType("application/json");
    res.json({status: true});
});



// ============================== DEPRECATED ==============================

// // @deprecated
// // Called by admin when assigning a task (command) for a database
// app.get(API_URL + "/task" + "/:t" + "/to" + "/:id", function (req, res) {
//     console.warn("Calling a deprecated function!");
//     console.log("API: task to called");
//     task = req.params.t;
//     to = req.params.id;
//     for (var i = 0; i < clients.length; i++) {
//         if (clients[i].id === to) {
//             clients[i].command = task;
//             res.json({status: true});
//         }
//     }
//     res.json({status: false});
// });


// // @deprecated
// // Return a task to do for the database
// app.get(API_URL + "/gettask" + "/:id", function (req, res) {
//     console.warn("Calling a deprecated function!");
//     reqId = req.params.id;
//     for (var i = 0; i < clients.length; i++) {
//         if (clients[i].id === reqId) {
//             clientPendingCommand = clients[i].command;
//             res.json({command: clientPendingCommand});
//             // reset the pending command
//             clients[i].command = "no";
//         }
//     }
// });



























