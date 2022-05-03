const mongodb = require("mongodb");

const CONFIG = require("../configs/config");

const CLASSES_COLLECTION_NAME = "schoolClasses";
const AUTOMATION_ENTRIES_COLLECTION_NAME = "schoolAutomationEntries";
const AUTOMATION_HISTORY_COLLECTION_NAME = "schoolAutomationHistory";

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
        return this.db.collection(CLASSES_COLLECTION_NAME);
    }

    getHistoryCollection() {
        if (!this.enabled) throw new Error("MongoDBClient is not enabled");
        return this.db.collection(AUTOMATION_HISTORY_COLLECTION_NAME);
    }

    getEntriesCollection() {
        if (!this.enabled) throw new Error("MongoDBClient is not enabled");
        return this.db.collection(AUTOMATION_ENTRIES_COLLECTION_NAME);
    }

    close() {
        if (!this.enabled) throw new Error("MongoDBClient is not enabled");
        return this.client.close();
    }
}

const mongodbClient = new MongoDBClient();

module.exports = mongodbClient;
