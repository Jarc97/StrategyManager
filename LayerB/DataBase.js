
class DataBase {
    constructor(name) {
        // this.name = name;
        this.strategy = {
            "command": "new",
            "database_name": name,
            "status": "OK",
            "time_interval":4,
            "type":"complete",
            "tables":[],
            "complete-interval":0
        };
    }

    stringify() {
        return JSON.stringify(this.strategy);
    }
}

module.exports = {
    DataBase : DataBase
};