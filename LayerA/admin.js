const url = "https://strategy-manager-g2.herokuapp.com/api";
// const url = "http://localhost:5000/api";

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
    // $("#mydiv").load("b.html");
    // To Do: select all children from a card

    // html = $("<p>hello</p>");
    // html.attr("id", "1");
    // html2 = $("<p>hello 2</p>");
    // html2.attr("id", "2");
    // $("#includedContentDiv").append(html);
    // $("#includedContentDiv").append(html2);

    //$("#includedContentDiv").add(hello)
    //$("#includedContent").load("b.html");
    //$("#includedContent").load("b.html");

    // With JQuery
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
            id = current.strategy.database_name;
            status = current.strategy.status;
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

function backup(description) {
    list = document.getElementsByClassName(description);
    id = list[0].innerHTML;
    backupCommandURL = "https://strategy-manager-g2.herokuapp.com/api/task/backup/to/" + id;
    // testingURL = "http://localhost:5000/api/task/backup/to/" + id;

    const Http = new XMLHttpRequest();
    Http.open("GET", backupCommandURL);
    Http.send();

    // fetch(testingURL)
    // .then((resp) => resp.json())
    // .then(function (data) {
    //     alert("Backup command sent");
    // })
    // .catch(function(error) {
    //     alert("Error sending backup command");
    // });
}

var selectedDB = "";

function setStrategy(dbName) {
    let name = document.getElementsByClassName(dbName)[0].innerHTML;
    selectedDB = name;
    document.getElementById("db-name").innerHTML = "Database Name: " + name;

    fetch(url + "/strat/" + name)
    .then((resp) => resp.json())
    .then(function(data) {
        let interval = data.time_interval;
        document.getElementById("db-interval").value = interval;
    })

    // interval = document.getElementById("db-interval").value;
    console.log(dbName);
}

function submit() {
    name = selectedDB;
    interval = document.getElementById("db-interval").value;
    fetch(url + "/setstrat/" + name + "/" + interval);
}

// Loop function for background updates
setInterval(function() {
    if (ready)
        update();
}, 
3000);

window.onload = initialize;