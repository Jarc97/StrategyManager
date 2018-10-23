// using the http module
let http = require('http');
var url  = require('url');
var fs   = require('fs');

const INDEX_URL = "/"
const API_URL = "/api"

// look for PORT environment variable, 
// else look for CLI argument,
// else use hard coded value for port 8080
port = process.env.PORT || process.argv[2] || 8080;
 
// create a simple server
let server = http.createServer(function (req, res) {
    if (req.url == '/') {
        fs.readFile('./index.html', function(err, data) {
            //let ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
            //console.log("Accessed " + INDEX_URL + " from " + ip);
            console.log("headers ---------------");
            console.log(req.headers('x-forwarded-for'));
            
            res.end(data);
        });
    }

    if (req.url == API_URL) {
        //let ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
        //console.log("Accessed " + API_URL + " from " + ip);
        res.end("This is the api");
    }
    /*
    res.writeHead(200, {
        'Content-Type': 'text/plain'
    });
    res.write('Administrador de estrategias de respaldo, Grupo 2', 'utf-8');
    res.end();
    */
});
 
// listen on the port
server.listen(port, function () {
    console.log("Server listening on port " + port);
});