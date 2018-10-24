
var fs = require('fs');
var express = require('express');
var Dropbox = require('dropbox').Dropbox;


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

app.use(express.static(__dirname + "/../LayerA/"));

const INDEX_URL = "/"
const API_URL = "/api"
// look for PORT environment variable, else look for CLI argument, else use hard coded value for port 8080
const PORT = process.env.PORT || process.argv[2] || 8080;


app.get(INDEX_URL, function (req, res) {
    let ip = req.header("x-forwarded-for");
    console.log("Accessed " + INDEX_URL + " from " + ip);
    // res.send('Administrador de estrategias de respaldo, Grupo 2');
    res.render("index.html");
});


app.get(API_URL, function (req, res) {
    res.send("This is the api.");
});


app.listen(PORT, function () {
    console.log('App listening on port ' + PORT);
});

