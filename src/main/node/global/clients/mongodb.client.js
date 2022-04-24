const mongodb = require("mongodb");

const CONFIG = require("../configs/config");

class MongoDBClient {
    constructor() {
        this.enabled = false;
    }

    async prepare(connectionString) {
        this.enabled = true;
        this.client = await new mongodb.MongoClient(connectionString).connect();
        this.db = this.client.db(CONFIG.mongodb.name);
        return this.client;
    }

    getClassesCollection() {
        if (!this.enabled) throw new Error("MongoDBClient is not enabled");
        return this.db.collection(CONFIG.mongodb.collectionNames.school.classes);
    }

    getHistoryCollection() {
        if (!this.enabled) throw new Error("MongoDBClient is not enabled");
        return this.db.collection(CONFIG.mongodb.collectionNames.school.automation.history);
    }

    getEntriesCollection() {
        if (!this.enabled) throw new Error("MongoDBClient is not enabled");
        return this.db.collection(CONFIG.mongodb.collectionNames.school.automation.entries);
    }

    close() {
        if (!this.enabled) throw new Error("MongoDBClient is not enabled");
        return this.client.close();
    }
}

const mongodbClient = new MongoDBClient();

module.exports = mongodbClient;
