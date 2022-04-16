const mongodb = require("mongodb");

const HistoryRecord = require("../data/history-record");
const automationUtils = require("../utils/automation.utils");
const mongodbClient = require("../../../global/clients/mongodb.client");
const EntryStatus = require("../configs/entry-status");

module.exports = {
    /**
     * thêm mới entry
     */
    async insert(entry) {
        const entriesCollection = mongodbClient.getEntriesCollection();
        const historyCollection = mongodbClient.getHistoryCollection();
        // create new entry has history record
        const insertEntryResult = await entriesCollection.insertOne(entry);
        const insertHistoryResult = await historyCollection.insertOne(new HistoryRecord());
        // create relation between entry and history
        const entryId = insertEntryResult.insertedId;
        const historyId = insertHistoryResult.insertedId;
        entriesCollection.updateOne(
            { _id: new mongodb.ObjectId(entryId) },
            { $set: { historyId } },
        );
        historyCollection.updateOne(
            { _id: new mongodb.ObjectId(historyId) },
            { $set: { entryId } },
        );
        return { entryId, historyId };
    },
    /**
     * NOTE: sử  dụng chung cho cả update entry và cancel entry
     * @param {String} entryId
     * @param {Entry} updateEntry
     */
    async update(entryId, updateEntry) {
        // prepare collection
        const entriesCollection = mongodbClient.getEntriesCollection();
        const historyCollection = mongodbClient.getHistoryCollection();
        // check exist first
        const existEntry = await entriesCollection.findOne({ _id: new mongodb.ObjectId(entryId) });
        if (!existEntry) {
            return "entry not exists";
        }
        // không tin tưởng user không được sử dụng trực tiếp entry từ input
        // vì có thể người dùng này cập nhật entry của người khác nếu biết _id
        if (existEntry.username !== updateEntry.username) {
            return "not your account";
        }
        if (existEntry.password !== updateEntry.password) {
            return "your password is same as before";
        }
        if (existEntry.status === EntryStatus.DONE) {
            return "your entry is done so insert new on instead";
        }
        if (existEntry.status === EntryStatus.CANCELED) {
            return "your entry is canceled so insert new on instead";
        }
        await entriesCollection.updateOne(
            { _id: new mongodb.ObjectId(entryId) },
            {
                $set: {
                    // not necessary to update username and password
                    actionId: updateEntry.actionId,
                    classIds: updateEntry.classIds,
                    timeToStart: updateEntry.timeToStart,
                    status: updateEntry.status,
                },
            },
        );
        // thêm log vào history của bản ghi cũ
        const ignoreKey = new Set([
            // ignore property for create difference between two entry
            "_id",
            "username",
            "created",
            "historyId",
        ]);
        const historyRecord = automationUtils.injectTimestampAt({
            diff: automationUtils.createEntryDiff(existEntry, updateEntry, {
                ignoreKey,
            }),
            message: "update",
        });
        await historyCollection.updateOne(
            { _id: new mongodb.ObjectId(existEntry.historyId) },
            {
                $push: {
                    details: historyRecord,
                },
            },
        );
        return "success";
    },
};
