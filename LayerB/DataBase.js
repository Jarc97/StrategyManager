
class DataBase {
    constructor(name) {
        this.strategy = {
            "lastPing": "",
            "isNew": "1",
            "database_name": name,
            "status": "OK",
            "time_interval": "4",
            "type":"complete",
            "complete-interval": "0",
            "log_name": "",
            "log_content": ""
        };
        let date = (new Date).getTime() / 1000
        this.strategy.lastPing = `${date}`
    }

    setLastPing(date) {
        let dateString = `${date}`
        this.strategy.lastPing = dateString
    }

    stringify() {
        return JSON.stringify(this.strategy);
    }
}

module.exports = {
    DataBase : DataBase
};