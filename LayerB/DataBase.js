
class DataBase {
    constructor(name) {
        this.lastPing = (new Date).getTime() / 1000;
        this.strategy = {
            "isNew": "1",
            "database_name": name,
            "status": "OK",
            "time_interval": "4",
            "type":"complete",
            "tables":[],
            "complete-interval": "0",
            "log_name": "",
            "log_content": ""
        };
    }

    stringify() {
        return JSON.stringify(this.strategy);
    }
}

module.exports = {
    DataBase : DataBase
};