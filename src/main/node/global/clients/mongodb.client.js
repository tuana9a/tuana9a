const mongodb = require("mongodb");

const CONFIG = require("../configs/config");
const HARDCODE = require("../configs/hardcode");

class MongoDBClient {
    constructor() {
        this.enabled = false;
    }

    async prepare(connectionString) {
        this.enabled = true;
        this.client = await new mongodb.MongoClient(connectionString).connect();
        this.db = this.client.db(CONFIG.database.name);
        return this.client;
    }

    getClassesCollection() {
        if (!this.enabled) throw new Error("MongoDBClient is not enabled");
        return this.db.collection(HARDCODE.collection.school.classes);
    }

    getHistoryCollection() {
        if (!this.enabled) throw new Error("MongoDBClient is not enabled");
        return this.db.collection(HARDCODE.collection.school.automation.history);
    }

    getEntriesCollection() {
        if (!this.enabled) throw new Error("MongoDBClient is not enabled");
        return this.db.collection(HARDCODE.collection.school.automation.entries);
    }

    close() {
        if (!this.enabled) throw new Error("MongoDBClient is not enabled");
        return this.client.close();
    }
}

const mongodbClient = new MongoDBClient();

module.exports = mongodbClient;
