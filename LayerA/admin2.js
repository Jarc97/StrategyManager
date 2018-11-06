const url = "https://strategy-manager-g2.herokuapp.com/api";
//const url = "http://localhost:5000/api"
var ready = false
var databases = []
var dbCurrentId = 1
var selectedDB = ""

const STATUS_OK = "bg-success"
const STATUS_WARNING = "bg-warning"
const STATUS_DISCONNECTED = "bg-danger"

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

// common id: dtbs_tag_id
class Database {
    constructor(name, status, log) {
        this.commonID = "dtbs"
        this.id = this.id()
        this.name = name
        this.status = status
        this.color = STATUS_OK
        this.log_content = log
        insertDatabaseCard(this)
    }

    getNameTag() {
        return `${this.commonID}_name_${this.id}`
    }
    getCardTag() {
        return `${this.commonID}_card_${this.id}`
    }
    getStatusTag() {
        return `${this.commonID}_status_${this.id}`
    }

    setName() {
        document.getElementById(this.getNameTag()).innerHTML = this.name
    }
    setStatus() {
        document.getElementById(this.getStatusTag()).innerHTML = `Current Status: ${this.status}`
        let temp = this.color
        if (this.status === "OK") {
            document.getElementById(this.getCardTag()).classList.remove(temp)
            document.getElementById(this.getCardTag()).classList.add(STATUS_OK)
            this.color = STATUS_OK
        }
        if (this.status === "ERROR") {
            document.getElementById(this.getCardTag()).classList.remove(temp)
            document.getElementById(this.getCardTag()).classList.add(STATUS_WARNING)
            this.color = STATUS_WARNING
        }
        if (this.status === "DISCONNECTED") {
            document.getElementById(this.getCardTag()).classList.remove(temp)
            document.getElementById(this.getCardTag()).classList.add(STATUS_DISCONNECTED)
            this.color = STATUS_DISCONNECTED
        }
    }

    id() { return dbCurrentId++; }

    draw() {
        this.setName()
        this.setStatus()
    }

    updateData(name, status, log) {
        this.name = name
        this.status = status
        this.log_content = log
    }
}

// This function inserts a card into the document.
// A card represents a registered database being monitored.
function insertDatabaseCard(Database) {
    let db_name = Database.name
    let bg_type = ""
    let status = ""
    switch (Database.status) {
        case "OK":
            bg_type = "bg-success"
            status = "OK"
            break
        default:
            bg_type = "bg-danger"
            status = "DISCONNECTED"
            break
    }
    let id = Database.id
    let cardHTML = `
    <div class="col-sm-6 col-lg-3">
        <div class="card text-white ${bg_type} mb-3 db-card" id="${Database.getCardTag()}" style="max-width: 18rem;">
            <div class="card-header" id="${Database.getNameTag()}">${db_name}</div>
            <div class="card-body">
                <h6 class="card-title" id="${Database.getStatusTag()}">Current Status: ${status}</h6>
            </div>
            <button type="button" class="btn btn-info" onclick="selectedDatabase('${db_name}');configureStrategy();" data-toggle="modal" data-target="#strategyModal"> Configure Strategy </button>
            <button type="button" class="btn btn-info" onclick="latestLog('${db_name}')" data-toggle="modal" data-target="#logModal"> Latest Log </button>
        </div>
    </div>`
    var db_container = document.getElementById("database-container")
    db_container.insertAdjacentHTML('beforeend', cardHTML)
}


// This function will be called multiple times indefinitely
// to get updates of the databases being monitored
function update() {
    fetch(url)
        .then((resp) => resp.json())
        .then(function (data) {
            for (var i = 0; i < data.length; i++) {
                let repeated = false
                current = data[i]
                db_name = current.database_name
                db_name = current.database_name
                db_status = current.status
                db_log = current.log_content

                // First verify the current doesn't exist
                for (var j = 0; j < databases.length; j++) {
                    if (databases[j].name === db_name)
                        repeated = true
                }
                if (!repeated) {
                    databases.push(new Database(db_name, db_status, db_log))
                } else {
                    databases[i].updateData(db_name, db_status, db_log)
                }
            }
        })
        .catch(function (error) {
            console.log(error)
        })
}


function draw() {
    for (let i = 0; i < databases.length; i++) {
        databases[i].draw()
    }
}


function selectedDatabase(name) {
    selectedDB = name
}


function configureStrategy() {
    document.getElementById("db-name").innerHTML = "Database Name: " + selectedDB;
    fetch(url + "/strat/" + selectedDB)
    .then((resp) => resp.json())
    .then(function(data) {
        let interval = data.time_interval;
        document.getElementById("backup-interval-input").value = interval;
    })
}


function saveStrategy() {
    interval = document.getElementById("backup-interval-input").value;
    fetch(url + "/setstrat/" + selectedDB + "/" + interval);

}


function latestLog(name) {
    fetch(url + "/strat/" + name)
    .then((resp) => resp.json())
    .then(function(data) {
        let log = data.log_content;
        document.getElementById("log-text-area").value = log;
    })
}


function initialize() {
    // await sleep(2000)
    //document.getElementById("asdf").innerHTML = ""
    ready = true

    // Loop function for background updates
    setInterval(function () {
        if (ready) {
            update()
            draw()
        }
    }, 3000)
}

window.onload = initialize