const url = "http://localhost:5000/api";

var _db1 = document.getElementsByClassName("_db1");
var _db2 = document.getElementsByClassName("_db2");
var _db3 = document.getElementsByClassName("_db3");
var _db4 = document.getElementsByClassName("_db4");
var dbCards = [_db1, _db2, _db3, _db4];

var ready = false;
const STATUS_OK = "bg-success";
const STATUS_WARNING = "bg-warning";
const STATUS_DOWN = "bg-danger";

function initialize() {
    
    ready = true;
}

function update() {
    console.log("updating...");
    fetch(url)
    .then((resp) => resp.json())
    .then(function(data) {
        console.log("server replied!");

        // for (var i in dbCards) {
        //     status = i
        // }


        // first = data[0];
        // first[id]
        // first[status]
        // if (first[status] === "Ok") {
        //     _db1[0].classList.remove(STATUS_WARNING);
        //     _db1[0].classList.add(STATUS_OK);
        // } else {
        //     _db1[0].classList.remove(STATUS_OK);
        //     _db1[0].classList.add(STATUS_DOWN);
        // }
        // console.log(first);
    })
    .catch(function(error) {
        console.log(error);
    });
}

// Loop function for background updates
setInterval(function() {
    if (ready)
        update();
}, 
3000);

window.onload = initialize;