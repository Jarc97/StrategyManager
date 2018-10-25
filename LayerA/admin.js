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

        for (var i = 0; i < data.length; i++) {
            current = data[i];
            id = current.id;
            status = current.status;
            statusText = "Current Status: " + status;

            statusTagString = "_db" + (i+1) + "-status";
            statusTag = document.getElementsByClassName(statusTagString);
            statusTag[0].innerHTML = statusText;

            descriptionTagString = "_db" + (i+1) + "-description";
            descriptionTag = document.getElementsByClassName(descriptionTagString);
            descriptionTag[0].innerHTML = id;
            
            switch (status) {
                case "OK":
                    dbCards[i][0].classList.remove(STATUS_DOWN);
                    dbCards[i][0].classList.add(STATUS_OK);
                    dbCards[i][1].classList.remove(STATUS_DOWN);
                    dbCards[i][1].classList.add(STATUS_OK);
                    break;
                case "DOWN":
                    dbCards[i][0].classList.remove(STATUS_OK);
                    dbCards[i][0].classList.add(STATUS_DOWN);
                    dbCards[i][1].classList.remove(STATUS_OK);
                    dbCards[i][1].classList.add(STATUS_DOWN);
                    break;
                default:
                    console.log("default");
                    break;
            }
        }
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