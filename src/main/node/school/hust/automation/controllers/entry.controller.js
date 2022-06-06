/* eslint-disable no-underscore-dangle */
const mongodb = require("mongodb");

const EntryStatus = require("../data/entry-status");
// eslint-disable-next-line no-unused-vars
const Entry = require("../data/entry");
const SafeError = require("../../../../global/exceptions/safe-error");
const HttpStatusCode = require("../../../../global/data/http-status-code");
const EntryHasHistory = require("../data/entry-has-history");
const HistoryRecord = require("../data/history-record");
const DateTime = require("../../../../global/data/datetime");

class EntryController {
    mongodbClient;

    automationUtils;

    getEntriesCollection() {
        return this.mongodbClient.getEntriesCollection();
    }

    getHistoryCollection() {
        return this.mongodbClient.getHistoryCollection();
    }

    getEntryHasHistoryCollection() {
        return this.mongodbClient.getEntryHasHistoryCollection();
    }

    /**
     * thêm mới entry
     * @param {Entry} entry
     */
    async insert(entry) {
        // create new entry has history record
        const insertEntryResult = await this.getEntriesCollection().insertOne(entry);
        // create relation between entry and history
        const entryId = insertEntryResult.insertedId;
        return { entryId };
    }

    /**
     * NOTE: sử  dụng chung cho cả update entry và cancel entry
     * @param {String} entryId
     * @param {*} updateEntry
     */
    async update(entryId, updateEntry) {
        // check exist first
        const existEntry = await this.getEntriesCollection().findOne({
            _id: new mongodb.ObjectId(entryId),
        });
        if (!existEntry) {
            throw new SafeError("entry not found", HttpStatusCode.NOT_FOUND);
        }
        // không tin tưởng user không được sử dụng trực tiếp entry từ input
        // vì có thể người dùng này cập nhật entry của người khác nếu biết _id
        if (existEntry.username !== updateEntry.username) {
            throw new SafeError("username not match", HttpStatusCode.FORBIDDEN);
        }
        if (existEntry.password !== updateEntry.password) {
            throw new SafeError("password not match", HttpStatusCode.FORBIDDEN);
        }
        if (existEntry.status === EntryStatus.DONE) {
            throw new SafeError("entry is done", HttpStatusCode.BAD_REQUEST);
        }
        if (existEntry.status === EntryStatus.CANCELED) {
            throw new SafeError("entry is canceled", HttpStatusCode.BAD_REQUEST);
        }
        const updateDTO = {};
        if (updateEntry.actionId) {
            updateDTO.actionId = updateEntry.actionId;
        }
        if (updateEntry.newUsername) {
            updateDTO.username = updateEntry.username;
        }
        if (updateEntry.newPassword) {
            updateDTO.password = updateEntry.newPassword;
        }
        if (updateEntry.classIds) {
            updateDTO.classIds = updateEntry.classIds;
        }
        if (updateEntry.timeToStart) {
            updateDTO.timeToStart = updateEntry.timeToStart;
        }
        if ([EntryStatus.CANCELED].includes(updateEntry.status)) {
            // hiện tại chỉ cho phép cancel thôi
            updateDTO.status = updateEntry.status;
        }
        await this.getEntriesCollection().updateOne(
            { _id: new mongodb.ObjectId(entryId) },
            {
                $set: updateDTO,
            },
        );
        // thêm log vào history của bản ghi cũ
        const ignoreKey = new Set([
            // ignore property for create difference between two entry
            "_id",
            "created",
        ]);
        const historyRecord = new HistoryRecord("update", existEntry);
        historyRecord.logs.push({
            diff: this.automationUtils.createEntryDiff(existEntry, updateDTO, {
                ignoreKey,
            }),
            at: new DateTime(),
        });
        const insertHistoryResult = await this.getHistoryCollection().insertOne(historyRecord);
        const entryHasHistory = new EntryHasHistory(new mongodb.ObjectId(entryId), insertHistoryResult.insertedId);
        await this.getEntryHasHistoryCollection().insertOne(entryHasHistory);
        return historyRecord;
    }

    async find({ username, password }) {
        const result = await this.getEntriesCollection().find({ username, password }).toArray();

        return result;
    }

    async processResult(historyRecord) {
        const { data: entry } = historyRecord;
        const insertHistoryResult = await this.getHistoryCollection().insertOne(historyRecord);
        const entryHasHistory = new EntryHasHistory(entry._id, insertHistoryResult.insertedId);
        await this.getEntryHasHistoryCollection().insertOne(entryHasHistory);
        await this.getEntriesCollection().updateOne(
            { _id: new mongodb.ObjectId(entry._id) },
            { $set: { status: historyRecord.isCompleted ? EntryStatus.DONE : EntryStatus.FAILED } },
        );
    }
}

module.exports = EntryController;
