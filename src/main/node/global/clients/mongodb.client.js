const mongodb = require("mongodb");

const CLASSES_COLLECTION_NAME = "schoolclasses";
const AUTOMATION_ENTRIES_COLLECTION_NAME = "schoolautomationentries";
const AUTOMATION_HISTORY_COLLECTION_NAME = "schoolautomationhistory";
const AUTOMATION_ENTRY_HAS_HISTORY_COLLECTION_NAME = "schoolautomationentryhashistory";

class MongoDBClient {
    CONFIG;

    async prepare(connectionString) {
        this.client = await new mongodb.MongoClient(connectionString).connect();
        this.db = this.client.db(this.CONFIG.mongodb.databaseName);
        return this.client;
    }

    getClassesCollection() {
        return this.db.collection(CLASSES_COLLECTION_NAME);
    }

    getHistoryCollection() {
        return this.db.collection(AUTOMATION_HISTORY_COLLECTION_NAME);
    }

    getEntriesCollection() {
        return this.db.collection(AUTOMATION_ENTRIES_COLLECTION_NAME);
    }

    getEntryHasHistoryCollection() {
        return this.db.collection(AUTOMATION_ENTRY_HAS_HISTORY_COLLECTION_NAME);
    }

    close() {
        return this.client.close();
    }
}

module.exports = MongoDBClient;
