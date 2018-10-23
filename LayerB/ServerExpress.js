
var express = require('express');
var app = express();

const INDEX_URL = "/"
const API_URL = "/api"

// look for PORT environment variable, 
// else look for CLI argument,
// else use hard coded value for port 8080
port = process.env.PORT || process.argv[2] || 8080;

app.get(INDEX_URL, function (req, res) {
    let ip = req.header("x-forwarded-for");
    console.log("Accessed " + INDEX_URL + " from " + ip);
    res.send('Administrador de estrategias de respaldo, Grupo 2');
});

app.get(API_URL, function (req, res) {
    res.send("This is the api.");
});

app.listen(port, function () {
  console.log('App listening on port ' + port);
});

