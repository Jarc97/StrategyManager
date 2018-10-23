
var express = require('express');
var app = express();

const INDEX_URL = "/"
const API_URL = "/api"

app.get(INDEX_URL, function (req, res) {
    let ip = req.header("x-forwarded-for");
    console.log("Accessed " + INDEX_URL + " from " + ip);
    res.send('Hello World!!');
});

app.get(API_URL, function (req, res) {
    res.send("This is the api.");
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

